import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { LocalStorageKey, MessageType, SocketEvent } from './common/enum';
import { ChatItem, FriendRequest, Message, Result } from './models/onchat.model';
import { FeedbackService } from './services/feedback.service';
import { LocalStorageService } from './services/local-storage.service';
import { OnChatService } from './services/onchat.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private socketService: SocketService,
    private onChatService: OnChatService,
    private feedbackService: FeedbackService,
    private toastController: ToastController,
    private localStorageService: LocalStorageService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    // 首先加载出缓存数据，保证用户体验
    const data = this.localStorageService.get(LocalStorageKey.ChatList);
    data && (this.onChatService.chatList = data);

    this.socketService.on(SocketEvent.Connect).subscribe(() => {
      if (this.onChatService.isLogin == null) {
        this.onChatService.checkLogin().subscribe((result: Result<number>) => {
          this.onChatService.isLogin = Boolean(result.data);
          this.onChatService.userId = result.data || undefined;
          if (result.data) {
            this.socketService.init();
            this.onChatService.init();
          }
        });
      } else if (this.onChatService.isLogin) {
        this.onChatService.init();
        this.socketService.init();
      }
    });

    this.socketService.on(SocketEvent.FriendRequest).subscribe((o: Result<FriendRequest | FriendRequest[]>) => {
      console.log('o: ', o);
      if (o.code != 0) { return; } //TODO
      if (Array.isArray(o.data)) {
        this.onChatService.friendRequests = o.data.sort((a: FriendRequest, b: FriendRequest) => b.updateTime - a.updateTime);
      } else {
        const friendRequest = o.data as FriendRequest;
        if (friendRequest.targetId == this.onChatService.userId) {
          const friendRequests = this.onChatService.friendRequests;
          const index = friendRequests.findIndex((v: FriendRequest) => v.id == friendRequest.id);
          // 如果这条好友申请已经在列表里
          if (index >= 0) {
            this.onChatService.friendRequests[index] = friendRequest;
          } else {
            this.onChatService.friendRequests.push(friendRequest);
            this.feedbackService.dingDengAudio.play();
          }
          this.onChatService.friendRequests = friendRequests.sort((a: FriendRequest, b: FriendRequest) => b.updateTime - a.updateTime);
        }
      }
    });

    this.socketService.on(SocketEvent.FriendRequestAgree).subscribe((result: Result<any>) => {
      if (result.code == 0) {
        // 如果申请人是自己，就播放提示音
        result.data.selfId == this.onChatService.userId && this.feedbackService.booAudio.play();

        this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
          this.onChatService.chatList = result.data;
        });

        const index = this.onChatService.friendRequests.findIndex((v: FriendRequest) => v.id == result.data.friendRequestId);

        index >= 0 && this.onChatService.friendRequests.splice(index, 1);
      }
    });

    this.socketService.on(SocketEvent.Init).subscribe((o) => {
      console.log(o)
    });

    this.socketService.on(SocketEvent.Message).subscribe((o: Result<Message>) => {
      console.log(o)
      // 如果消息不是自己的话，就播放提示音
      o.data.userId != this.onChatService.userId && this.feedbackService.booAudio.play();

      // 然后去列表里面找
      const index = this.onChatService.chatList.findIndex((v: ChatItem) => v.chatroomId == o.data.chatroomId);

      if (index >= 0) {
        if (this.onChatService.chatroomId == o.data.chatroomId) { // 如果用户已经进入消息所属房间
          this.onChatService.chatList[index].unread = 0;
        } else {
          this.onChatService.chatList[index].unread++;
        }
        this.onChatService.chatList[index].latestMsg = o.data;
        this.onChatService.chatList[index].updateTime = Date.now();
        this.onChatService.chatList = this.onChatService.chatList;
      } else { // 如果不存在于列表当中，就刷新数据
        this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
          this.onChatService.chatList = result.data;
        });
      }
    });

    this.socketService.on(SocketEvent.RevokeMsg).subscribe((o: Result<{ chatroomId: number, msgId: number }>) => {
      if (o.code != 0) { return; }
      // 收到撤回消息的信号，去聊天列表里面找，找的到就更新一下，最新消息
      const index = this.onChatService.chatList.findIndex((v: ChatItem) => v.chatroomId == o.data.chatroomId);
      if (index >= 0) {
        const chatItem = this.onChatService.chatList[index];
        chatItem.unread > 0 && chatItem.unread--;
        chatItem.latestMsg = JSON.parse(JSON.stringify(chatItem.latestMsg));
        chatItem.latestMsg.type = MessageType.Tips;
        chatItem.latestMsg.data.content = chatItem.latestMsg.nickname + ' 撤回了一条消息';
        chatItem.updateTime = Date.now();
        this.onChatService.chatList[index] = chatItem;
        this.onChatService.chatList = this.onChatService.chatList;
      }
    });

    this.socketService.on(SocketEvent.Disconnect).subscribe(() => {
      this.presentToast('与服务器断开连接！');
    });

    this.socketService.on(SocketEvent.Reconnect).subscribe(() => {
      this.onChatService.checkLogin().subscribe((result: Result<number>) => {
        this.onChatService.isLogin = Boolean(result.data);
        this.onChatService.userId = result.data || undefined;
        if (this.onChatService.isLogin) {
          this.socketService.init();
          this.onChatService.init();
        }
      });
      this.presentToast('与服务器重连成功！');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}
