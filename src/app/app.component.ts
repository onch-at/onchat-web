import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationStart, Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { filter, mergeMap } from 'rxjs/operators';
import { ChatSessionType, LocalStorageKey, MessageType, ResultCode, SocketEvent } from './common/enum';
import { NotificationOptions } from './common/interface';
import { RichTextMessage, TextMessage } from './models/form.model';
import { AgreeFriendRequest, ChatRequest, ChatSession, FriendRequest, Message, Result, User } from './models/onchat.model';
import { FeedbackService } from './services/feedback.service';
import { GlobalDataService } from './services/global-data.service';
import { LocalStorageService } from './services/local-storage.service';
import { OnChatService } from './services/onchat.service';
import { OverlayService } from './services/overlay.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private location: Location,
    private router: Router,
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private socketService: SocketService,
    private onChatService: OnChatService,
    private feedbackService: FeedbackService,
    private overlayService: OverlayService,
    private localStorageService: LocalStorageService,
    public globalDataService: GlobalDataService,
  ) { }

  ngOnInit() {
    // 首先加载出缓存数据，保证用户体验
    const data = this.localStorageService.get(LocalStorageKey.ChatSessions);
    if (data) {
      this.globalDataService.chatSessions = data;
      this.globalDataService.totalUnreadMsgCount();
    }

    // 连接打通时
    this.socketService.on(SocketEvent.Connect).pipe(
      mergeMap(() => this.onChatService.checkLogin())
    ).subscribe((result: Result<boolean | User>) => {
      const { data } = result;
      this.globalDataService.user = data ? data as User : null;
      if (!data) {
        // 如果不在用户登录、注册页，就跳转
        const isNotAuthPage = /^(?!(\/user\/(login|register)))/.test(this.location.path());
        return isNotAuthPage && this.router.navigateByUrl('/user/login');
      }

      this.socketService.init();
      this.onChatService.init();
    });

    // 发起/收到好友申请时
    this.socketService.on(SocketEvent.FriendRequest).subscribe((result: Result<FriendRequest>) => {
      console.log('result: ', result);
      if (result.code !== ResultCode.Success) { return; } //TODO
      const friendRequest = result.data;
      // 收到好友申请提示，判断自己是不是被申请人
      if (friendRequest.targetId == this.globalDataService.user.id) {
        const index = this.globalDataService.receiveFriendRequests.findIndex(o => o.id == friendRequest.id);
        // 如果这条好友申请已经在列表里
        if (index >= 0) {
          this.globalDataService.receiveFriendRequests[index] = friendRequest; // 静默更改
        } else {
          this.globalDataService.receiveFriendRequests.unshift(friendRequest);
        }

        const opts: NotificationOptions = {
          icon: friendRequest.selfAvatarThumbnail,
          title: '收到好友申请',
          description: '用户 ' + friendRequest.selfUsername + ' 申请添加你为好友',
          url: '/friend/handle/' + friendRequest.selfId
        };

        document.hidden ? this.overlayService.presentNativeNotification(opts) : this.overlayService.presentNotification(opts);
        this.feedbackService.dingDengAudio.play();
      } else if (friendRequest.selfId == this.globalDataService.user.id) {
        const index = this.globalDataService.sendFriendRequests.findIndex(o => o.id == friendRequest.id);
        // 如果这条好友申请已经在列表里
        if (index >= 0) {
          this.globalDataService.sendFriendRequests[index] = friendRequest; // 静默更改
        } else {
          this.globalDataService.sendFriendRequests.unshift(friendRequest);
        }
      }
    });

    // 同意好友申请/收到同意好友申请
    this.socketService.on(SocketEvent.FriendRequestAgree).pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe((result: Result<AgreeFriendRequest>) => {
      const { data } = result;
      console.log('result: ', result);

      // 如果申请人是自己（我的好友申请被同意了）
      if (data.selfId == this.globalDataService.user.id) {
        // 去我发出的申请列表里面找这条FriendRequest，并删除
        let index = this.globalDataService.sendFriendRequests.findIndex(o => o.id == data.friendRequestId);
        index >= 0 && this.globalDataService.sendFriendRequests.splice(index, 1);
        // 去我收到的申请列表里面通过找这条FriendRequest，并删除
        index = this.globalDataService.receiveFriendRequests.findIndex(o => o.selfId == data.targetId);
        index >= 0 && this.globalDataService.receiveFriendRequests.splice(index, 1);

        const opts: NotificationOptions = {
          icon: data.targetAvatarThumbnail,
          title: '好友申请已同意',
          description: '已和 ' + data.targetUsername + ' 成为好友',
          url: '/chat/' + data.chatroomId
        };

        document.hidden ? this.overlayService.presentNativeNotification(opts) : this.overlayService.presentNotification(opts);
        this.feedbackService.booAudio.play();
      } else if (data.targetId == this.globalDataService.user.id) { // 如果自己是被申请人
        const index = this.globalDataService.receiveFriendRequests.findIndex(o => o.id == data.friendRequestId);
        index >= 0 && this.globalDataService.receiveFriendRequests.splice(index, 1);

        this.overlayService.presentToast('成功添加新好友');
      }

      // 更新一下聊天列表
      this.onChatService.initChatSession().subscribe();

      // 更新好友列表
      if (this.globalDataService.privateChatrooms.length) {
        this.globalDataService.privateChatroomsPage = 1;
        this.onChatService.getPrivateChatrooms().subscribe((result: Result<ChatSession[]>) => {
          if (result.code !== ResultCode.Success) { return; }

          this.globalDataService.privateChatrooms = result.data;
        });
      }
    });

    // 拒绝好友申请/收到拒绝好友申请
    this.socketService.on(SocketEvent.FriendRequestReject).pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe((result: Result<FriendRequest>) => {
      console.log('result: ', result);

      const friendRequest = result.data;
      // 如果申请人是自己
      if (friendRequest.selfId == this.globalDataService.user.id) {
        const index = this.globalDataService.sendFriendRequests.findIndex(o => o.id == friendRequest.id);
        if (index >= 0) {
          this.globalDataService.sendFriendRequests[index] = friendRequest;
        } else {
          this.globalDataService.sendFriendRequests.unshift(friendRequest);
        }

        const opts: NotificationOptions = {
          icon: friendRequest.targetAvatarThumbnail,
          title: '好友申请被拒绝',
          description: '用户 ' + friendRequest.targetUsername + ' 拒绝了你的好友申请',
          url: '/friend/request/' + friendRequest.targetId
        };

        document.hidden ? this.overlayService.presentNativeNotification(opts) : this.overlayService.presentNotification(opts);
        this.feedbackService.dingDengAudio.play();
      } else if (friendRequest.targetId == this.globalDataService.user.id) { // 如果自己是被申请人
        const index = this.globalDataService.receiveFriendRequests.findIndex(o => o.id == friendRequest.id);
        index >= 0 && this.globalDataService.receiveFriendRequests.splice(index, 1);

        this.overlayService.presentToast('已拒绝该好友申请');
      }
    });

    // 收到消息时
    this.socketService.on(SocketEvent.Message).pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe((result: Result<Message>) => {
      const msg = result.data;
      console.log(result)
      const { chatroomId, user } = this.globalDataService;
      // 先去聊天列表缓存里面查，看看有没有这个房间的数据
      const chatSession = this.globalDataService.chatSessions.find(o => o.data.chatroomId == msg.chatroomId);

      // 如果消息不是自己的话，就播放提示音
      if (msg.userId != user.id) {
        const chatroomName = chatSession ? chatSession.title : '收到新消息';

        let content = '[收到新消息]';
        switch (msg.type) {
          case MessageType.Text:
            content = (msg.data as TextMessage).content;
            break;

          case MessageType.RichText:
            content = (msg.data as RichTextMessage).text;
            break;

          case MessageType.ChatInvitation:
            content = '[分享]邀请加入群聊';
            break;
        }

        const opts: NotificationOptions = {
          icon: msg.avatarThumbnail || null, // TODO 群聊的头像
          title: chatroomName,
          description: (chatroomName !== msg.nickname ? msg.nickname + '：' : '') + content,
          url: '/chat/' + msg.chatroomId
        };

        // 并且不在同一个房间，就弹出通知
        if (msg.chatroomId != chatroomId) {
          document.hidden ? this.overlayService.presentNativeNotification(opts) : this.overlayService.presentNotification(opts);
        } else if (document.hidden) {
          this.overlayService.presentNativeNotification(opts);
        }

        this.feedbackService.booAudio.play();
      }

      if (chatSession) {
        // 如果用户已经进入消息所属房间
        if (chatroomId == msg.chatroomId) {
          chatSession.unread = 0;
        } else if (msg.userId != this.globalDataService.user.id) {
          chatSession.unread++;
        }

        chatSession.content = msg;
        chatSession.updateTime = Date.now();
        this.globalDataService.sortChatSessions();
      } else { // 如果不存在于列表当中，就刷新数据
        this.onChatService.initChatSession().subscribe();
      }
    });

    // 撤回消息时
    this.socketService.on(SocketEvent.RevokeMsg).pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe((result: Result<{ chatroomId: number, msgId: number }>) => {
      // 收到撤回消息的信号，去聊天列表里面找，找的到就更新一下，最新消息
      const index = this.globalDataService.chatSessions.findIndex(o => o.data.chatroomId == result.data.chatroomId);
      if (index >= 0) {
        const chatSession = this.globalDataService.chatSessions[index];
        chatSession.unread > 0 && chatSession.unread--;
        chatSession.content = JSON.parse(JSON.stringify(chatSession.content));
        chatSession.content.type = MessageType.Tips;
        const name = chatSession.content.userId == this.globalDataService.user.id ? '我' : chatSession.content.nickname;
        (chatSession.content.data as any).content = name + ' 撤回了一条消息';
        chatSession.updateTime = Date.now();
        this.globalDataService.chatSessions[index] = chatSession;
        this.globalDataService.sortChatSessions();
      }
    });

    // 收到入群申请时
    this.socketService.on(SocketEvent.ChatRequest).pipe(
      filter((result: Result<ChatRequest>) => {
        const { code, data } = result;
        // 如果申请人不是自己
        return code === ResultCode.Success && data?.applicantId !== this.globalDataService.user.id;
      })
    ).subscribe((result: Result<ChatRequest>) => {
      const { data } = result;
      const chatSession = this.globalDataService.chatSessions.find(o => o.type === ChatSessionType.ChatroomNotice);
      // 如果列表里没有聊天室通知会话,就需要重新拉取
      if (!chatSession) {
        return this.onChatService.initChatSession().subscribe();
      }

      const index = this.globalDataService.receiveChatRequests.findIndex(o => o.id === data.id);

      if (index >= 0) {
        this.globalDataService.receiveChatRequests[index] = data;
        this.globalDataService.sortChatRequests();
      } else {
        this.globalDataService.receiveChatRequests.unshift(data);
        this.feedbackService.booAudio.play();
      }

      chatSession.updateTime = Date.now();
      this.globalDataService.sortChatSessions();
      this.globalDataService.totalUnreadMsgCount();
    });

    this.router.events.subscribe((event: Event) => {
      this.globalDataService.navigationLoading = event instanceof NavigationStart;

      // 如果路由返回被取消，就震动一下，表示阻止
      if (event instanceof NavigationCancel) {
        this.feedbackService.slightVibrate();
      }
    });

    this.checkSocketConnectState();

    this.checkUpdate();

    this.initNativeNotification();
  }

  /**
   * 检测套接字连接状态
   */
  checkSocketConnectState() {
    // 连接断开时
    this.socketService.on(SocketEvent.Disconnect).subscribe(() => {
      this.overlayService.presentToast('与服务器断开连接！');
    });

    // 连接失败时
    this.socketService.on(SocketEvent.ReconnectError).subscribe(() => {
      this.overlayService.presentToast('服务器连接失败！');
    });

    // 重连成功时
    this.socketService.on(SocketEvent.Reconnect).subscribe(() => {
      this.overlayService.presentToast('与服务器重连成功！');
    });
  }

  /**
   * 检测更新
   */
  checkUpdate() {
    this.swUpdate.available.subscribe(() => this.swUpdate.activateUpdate().then(() => {
      this.overlayService.presentAlert({
        header: '发现新版本',
        message: '是否立即重启以更新到新版本？',
        backdropDismiss: false,
        confirmHandler: () => document.location.reload()
      });
    }));
  }

  /**
   * 初始化原生通知
   */
  initNativeNotification() {
    if ('Notification' in window) {
      const granted = 'granted';
      Notification.permission !== granted && Notification.requestPermission().then((permission: string) => {
        permission === granted && this.overlayService.presentToast('通知权限授权成功！');
      });

      this.swPush.notificationClicks.subscribe(event => {
        const { url } = event.notification.data;
        this.router.navigateByUrl(url)
        window.focus();
      });
    }
  }

}
