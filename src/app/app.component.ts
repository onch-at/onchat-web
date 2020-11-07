
import { Component, OnInit } from '@angular/core';
import { NavigationCancel, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { race } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { LocalStorageKey, MessageType, SessionStorageKey, SocketEvent } from './common/enum';
import { RichTextMessage, TextMessage } from './models/form.model';
import { ChatItem, FriendRequest, Message, Result, User } from './models/onchat.model';
import { FeedbackService } from './services/feedback.service';
import { LocalStorageService } from './services/local-storage.service';
import { OnChatService } from './services/onchat.service';
import { OverlayService } from './services/overlay.service';
import { SessionStorageService } from './services/session-storage.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private swUpdate: SwUpdate,
    private socketService: SocketService,
    private onChatService: OnChatService,
    private feedbackService: FeedbackService,
    private overlayService: OverlayService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit() {
    // 首先加载出缓存数据，保证用户体验
    const data = this.localStorageService.get(LocalStorageKey.ChatList);
    data && (this.onChatService.chatList = data);

    // 连接打通时
    this.socketService.on(SocketEvent.Connect).pipe(
      mergeMap(() => this.onChatService.checkLogin())
    ).subscribe((result: Result<boolean | User>) => {
      this.onChatService.user = result.data ? result.data as User : null;
      if (result.data) {
        this.socketService.init();
        this.onChatService.init();
        const user = result.data as User;
        this.sessionStorageService.setItemToMap(
          SessionStorageKey.UserMap,
          user.id,
          user
        );
      } else {
        this.router.navigate(['/user/login']);
      }
    });

    // 发起/收到好友申请时
    this.socketService.on(SocketEvent.FriendRequest).subscribe((result: Result<FriendRequest>) => {
      console.log('result: ', result);
      if (result.code != 0) { return; } //TODO
      const friendRequest = result.data;
      // 收到好友申请提示，判断自己是不是被申请人
      if (friendRequest.targetId == this.onChatService.user.id) {
        const index = this.onChatService.receiveFriendRequests.findIndex((v: FriendRequest) => v.id == friendRequest.id);
        // 如果这条好友申请已经在列表里
        if (index >= 0) {
          this.onChatService.receiveFriendRequests[index] = friendRequest; // 静默更改
        } else {
          this.onChatService.receiveFriendRequests.unshift(friendRequest);
          this.feedbackService.dingDengAudio.play();
        }

        this.overlayService.presentNotification({
          iconUrl: friendRequest.selfAvatarThumbnail,
          title: '收到好友申请',
          description: '用户 ' + friendRequest.selfUsername + ' 申请添加你为好友',
          tapHandler: () => {
            this.router.navigate(['/friend/handle', friendRequest.selfId]);
          }
        });
      } else if (friendRequest.selfId == this.onChatService.user.id) {
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
        // 如果申请人是自己（我的好友申请被同意了）
        if (result.data.selfId == this.onChatService.user.id) {
          // 去我发出的申请列表里面找这条FriendRequest，并删除
          let index = this.onChatService.sendFriendRequests.findIndex((v: FriendRequest) => v.id == result.data.friendRequestId);
          index >= 0 && this.onChatService.sendFriendRequests.splice(index, 1);
          // 去我收到的申请列表里面通过找这条FriendRequest，并删除
          index = this.onChatService.receiveFriendRequests.findIndex((v: FriendRequest) => v.selfId == result.data.targetId);
          index >= 0 && this.onChatService.receiveFriendRequests.splice(index, 1);

          this.feedbackService.booAudio.play();

          this.overlayService.presentNotification({
            iconUrl: result.data.targetAvatarThumbnail,
            title: '好友申请已同意',
            description: '已和 ' + result.data.targetUsername + ' 成为好友',
            tapHandler: () => {
              this.router.navigate(['/chat', result.data.chatroomId]);
            }
          });
        } else if (result.data.targetId == this.onChatService.user.id) { // 如果自己是被申请人
          const index = this.onChatService.receiveFriendRequests.findIndex((v: FriendRequest) => v.id == result.data.friendRequestId);
          index >= 0 && this.onChatService.receiveFriendRequests.splice(index, 1);

          this.overlayService.presentToast('成功添加新好友');
        }

        // 更新一下聊天列表
        this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
          this.onChatService.chatList = result.data;
        });
      }
    });

    // 拒绝好友申请/收到拒绝好友申请
    this.socketService.on(SocketEvent.FriendRequestReject).subscribe((result: Result<FriendRequest>) => {
      console.log('result: ', result);
      if (result.code == 0) {
        const friendRequest = result.data;
        // 如果申请人是自己
        if (friendRequest.selfId == this.onChatService.user.id) {
          const index = this.onChatService.sendFriendRequests.findIndex((v: FriendRequest) => v.id == friendRequest.id);
          if (index >= 0) {
            this.onChatService.sendFriendRequests[index] = friendRequest;
          } else {
            this.onChatService.sendFriendRequests.unshift(friendRequest);
          }

          this.feedbackService.dingDengAudio.play();

          this.overlayService.presentNotification({
            iconUrl: friendRequest.targetAvatarThumbnail,
            title: '好友申请被拒绝',
            description: '用户 ' + friendRequest.targetUsername + ' 拒绝了你的好友申请',
            tapHandler: () => {
              this.router.navigate(['/friend/request', friendRequest.targetId]);
            }
          });
        } else if (friendRequest.targetId == this.onChatService.user.id) { // 如果自己是被申请人
          const index = this.onChatService.receiveFriendRequests.findIndex((v: FriendRequest) => v.id == friendRequest.id);
          index >= 0 && this.onChatService.receiveFriendRequests.splice(index, 1);

          this.overlayService.presentToast('已拒绝该好友申请');
        }
      }
    });

    // 收到消息时
    this.socketService.on(SocketEvent.Message).subscribe((result: Result<Message>) => {
      if (result.code != 0) {
        return;
      }

      const msg = result.data;
      console.log(result)
      // 先去聊天列表缓存里面查，看看有没有这个房间的数据
      const index = this.onChatService.chatList.findIndex((v: ChatItem) => v.chatroomId == msg.chatroomId);

      // 如果消息不是自己的话，就播放提示音
      if (msg.userId != this.onChatService.user.id) {
        // 并且不在同一个房间，就弹出通知
        if (msg.chatroomId != this.onChatService.chatroomId) {
          const roomName = index >= 0 ? this.onChatService.chatList[index].name : '收到新消息';

          let content = '[收到新消息]';
          switch (msg.type) {
            case MessageType.Text:
              content = (msg.data as TextMessage).content;
              break;

            case MessageType.RichText:
              content = (msg.data as RichTextMessage).text;
              break;
          }

          this.overlayService.presentNotification({
            iconUrl: msg.avatarThumbnail || null, // TODO 群聊的头像
            title: roomName,
            description: msg.nickname + '：' + content,
            tapHandler: () => {
              this.router.navigate(['/chat', msg.chatroomId]);
            }
          });
        }

        this.feedbackService.booAudio.play();
      }

      if (index >= 0) {
        if (this.onChatService.chatroomId == msg.chatroomId) { // 如果用户已经进入消息所属房间
          this.onChatService.chatList[index].unread = 0;
        } else {
          this.onChatService.chatList[index].unread++;
        }
        this.onChatService.chatList[index].latestMsg = msg;
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
        const name = chatItem.latestMsg.userId == this.onChatService.user.id ? '我' : chatItem.latestMsg.nickname;
        (chatItem.latestMsg.data as any).content = name + ' 撤回了一条消息';
        chatItem.updateTime = Date.now();
        this.onChatService.chatList[index] = chatItem;
        this.onChatService.chatList = this.onChatService.chatList;
      }
    });

    // 连接断开时
    this.socketService.on(SocketEvent.Disconnect).subscribe(() => {
      this.overlayService.presentToast('与服务器断开连接！');
    });

    // 连接失败时
    race(
      this.socketService.on(SocketEvent.ConnectError),
      this.socketService.on(SocketEvent.ReconnectError)
    ).subscribe(() => {
      this.overlayService.presentToast('服务器连接失败！');
    });

    // 重连成功时
    this.socketService.on(SocketEvent.Reconnect).subscribe(() => {
      this.overlayService.presentToast('与服务器重连成功！');
    });

    // 如果路由返回被取消，就震动一下，表示阻止
    this.router.events.pipe(
      filter(event => event instanceof NavigationCancel)
    ).subscribe(() => this.feedbackService.vibrate());

    this.swUpdate.available.subscribe(() => this.swUpdate.activateUpdate().then(() => {
      this.overlayService.presentAlert({
        header: '发现新版本',
        message: '是否立即重启以更新到新版本？',
        confirmHandler: () => document.location.reload()
      });
    }));
  }

}
