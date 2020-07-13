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

    // 连接打通时
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

    // 发起/收到好友申请时
    this.socketService.on(SocketEvent.FriendRequest).subscribe((o: Result<FriendRequest>) => {
      console.log('o: ', o);
      if (o.code != 0) { return; } //TODO
      const friendRequest = o.data;
      // 收到好友申请提示，判断自己是不是被申请人
      if (friendRequest.targetId == this.onChatService.userId) {
        const index = this.onChatService.receiveFriendRequests.findIndex((v: FriendRequest) => v.id == friendRequest.id);
        // 如果这条好友申请已经在列表里
        if (index >= 0) {
          this.onChatService.receiveFriendRequests[index] = friendRequest; // 静默更改
        } else {
          this.onChatService.receiveFriendRequests.unshift(friendRequest);
          this.feedbackService.dingDengAudio.play();
        }
      } else if (friendRequest.selfId == this.onChatService.userId) {
        const index = this.onChatService.sendFriendRequests.findIndex((v: FriendRequest) => v.id == friendRequest.id);
        // 如果这条好友申请已经在列表里
        if (index >= 0) {
          this.onChatService.sendFriendRequests[index] = friendRequest; // 静默更改
        } else {
          this.onChatService.sendFriendRequests.unshift(friendRequest);
        }
      }
    });

    // 同意好友申请/收到同意好友申请
    this.socketService.on(SocketEvent.FriendRequestAgree).subscribe((result: Result<any>) => {
      console.log('result: ', result);
      if (result.code == 0) {
        // 如果申请人是自己，就播放提示音
        result.data.selfId == this.onChatService.userId && this.feedbackService.booAudio.play();

        result.data.targetId == this.onChatService.userId && this.presentToast('成功添加新好友');

        this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
          this.onChatService.chatList = result.data;
        });

        const index = this.onChatService.receiveFriendRequests.findIndex((v: FriendRequest) => v.id == result.data.friendRequestId);

        index >= 0 && this.onChatService.receiveFriendRequests.splice(index, 1);
      }
    });

    // 拒绝好友申请/收到拒绝好友申请
    this.socketService.on(SocketEvent.FriendRequestReject).subscribe((result: Result<FriendRequest>) => {
      console.log('result: ', result);
      if (result.code == 0) {
        const friendRequest = result.data;
        // 如果申请人是自己，就播放提示音
        friendRequest.selfId == this.onChatService.userId && this.feedbackService.dingDengAudio.play();

        friendRequest.targetId == this.onChatService.userId && this.presentToast('已拒绝该好友申请');

        const index = this.onChatService.receiveFriendRequests.findIndex((v: FriendRequest) => v.id == friendRequest.id);

        index >= 0 && this.onChatService.receiveFriendRequests.splice(index, 1);

        // this.onChatService.receiveFriendRequests.unshift(friendRequest);
      }
    });

    // 初始化时 暂时没有信息返回
    // this.socketService.on(SocketEvent.Init).subscribe((o) => {
    //   console.log(o)
    // });

    // 收到消息时
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

    // 撤回消息时
    this.socketService.on(SocketEvent.RevokeMsg).subscribe((o: Result<{ chatroomId: number, msgId: number }>) => {
      if (o.code != 0) { return; }
      // 收到撤回消息的信号，去聊天列表里面找，找的到就更新一下，最新消息
      const index = this.onChatService.chatList.findIndex((v: ChatItem) => v.chatroomId == o.data.chatroomId);
      if (index >= 0) {
        const chatItem = this.onChatService.chatList[index];
        chatItem.unread > 0 && chatItem.unread--;
        chatItem.latestMsg = JSON.parse(JSON.stringify(chatItem.latestMsg));
        chatItem.latestMsg.type = MessageType.Tips;
        const name = chatItem.latestMsg.userId == this.onChatService.userId ? '我' : chatItem.latestMsg.nickname;
        chatItem.latestMsg.data.content = name + ' 撤回了一条消息';
        chatItem.updateTime = Date.now();
        this.onChatService.chatList[index] = chatItem;
        this.onChatService.chatList = this.onChatService.chatList;
      }
    });

    // 连接断开时
    this.socketService.on(SocketEvent.Disconnect).subscribe(() => {
      this.presentToast('与服务器断开连接！');
    });

    // 重连时
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
      message,
      duration: 2000,
      color: 'dark'
    });
    toast.present();
  }
}
