import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter, mergeMap } from 'rxjs/operators';
import { AudioName, ChatSessionType, FriendRequestStatus, LocalStorageKey, MessageType, ResultCode, SocketEvent } from './common/enum';
import { RevokeMessageTipsMessage } from './models/msg.model';
import { AgreeFriendRequest, ChatRequest, ChatSession, FriendRequest, Message, Result, User } from './models/onchat.model';
import { MessageDescPipe } from './pipes/message-desc.pipe';
import { ApiService } from './services/api.service';
import { AppService } from './services/app.service';
import { CacheService } from './services/cache.service';
import { FeedbackService } from './services/feedback.service';
import { GlobalData } from './services/global-data.service';
import { LocalStorage } from './services/local-storage.service';
import { OnChatService } from './services/onchat.service';
import { Overlay } from './services/overlay.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  private messageDescPipe: MessageDescPipe = new MessageDescPipe();

  constructor(
    public globalData: GlobalData,
    private router: Router,
    private overlay: Overlay,
    private navCtrl: NavController,
    private apiService: ApiService,
    private appService: AppService,
    private cacheService: CacheService,
    private localStorage: LocalStorage,
    private socketService: SocketService,
    private onChatService: OnChatService,
    private feedbackService: FeedbackService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    // 首先加载出缓存数据，保证用户体验
    const data = this.localStorage.get<ChatSession[]>(LocalStorageKey.ChatSessions, null);
    if (data) {
      this.globalData.chatSessions = data;
    }

    // 连接打通时
    this.socketService.on(SocketEvent.Connect).pipe(
      mergeMap(() => this.apiService.checkLogin())
    ).subscribe(({ data }: Result<false | User>) => {
      this.globalData.user = data || null;

      this.socketService.init();
      this.onChatService.init();
    });

    // 发起/收到好友申请时
    this.socketService.on(SocketEvent.FriendRequest).subscribe(({ code, data }: Result<FriendRequest>) => {
      if (code !== ResultCode.Success) { return; } //TODO
      const { user } = this.globalData;
      // 收到好友申请提示，如果自己是被申请人
      if (data.targetId === user.id) {
        const index = this.globalData.receiveFriendRequests.findIndex(o => o.id === data.id);
        // 如果这条好友申请已经在列表里
        if (index >= 0) {
          this.globalData.receiveFriendRequests[index] = data; // 静默更改
        } else {
          this.globalData.receiveFriendRequests.unshift(data);
        }

        this.overlay.presentNotification({
          icon: data.requesterAvatarThumbnail,
          title: '收到好友申请',
          description: '用户 ' + data.requesterNickname + ' 申请添加你为好友',
          url: '/friend/handle/' + data.requesterId
        });
        this.feedbackService.playAudio(AudioName.DingDeng);
      } else if (data.requesterId === user.id) {
        const index = this.globalData.sendFriendRequests.findIndex(o => o.id === data.id);
        // 如果这条好友申请已经在列表里
        if (index >= 0) {
          this.globalData.sendFriendRequests[index] = data; // 静默更改
        } else {
          this.globalData.sendFriendRequests.unshift(data);
        }
      }
    });

    // 同意好友申请/收到同意好友申请
    this.socketService.on(SocketEvent.FriendRequestAgree).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(({ data }: Result<AgreeFriendRequest>) => {
      const { user, receiveFriendRequests } = this.globalData;
      // 如果申请人是自己（我发的好友申请被同意了）
      if (data.requesterId === user.id) {
        // 去我发出的申请列表里面找这条FriendRequest，并删除
        const request = this.globalData.sendFriendRequests.find(o => o.id === data.friendRequestId);
        if (request) {
          request.status = FriendRequestStatus.Agree;
          request.requesterReaded = true;
        }
        // 去我收到的申请列表里面通过找这条FriendRequest，并删除
        this.globalData.receiveFriendRequests = receiveFriendRequests.filter(o => o.requesterId !== data.targetId);

        this.overlay.presentNotification({
          icon: data.targetAvatarThumbnail,
          title: '好友申请已同意',
          description: '已和 ' + data.targetNickname + ' 成为好友',
          url: '/chat/' + data.chatroomId
        });
        this.feedbackService.playAudio(AudioName.Boo);
      } else if (data.targetId === user.id) { // 如果自己是被申请人
        const request = this.globalData.receiveFriendRequests.find(o => o.id === data.friendRequestId);
        if (request) {
          request.status = FriendRequestStatus.Agree;
          request.targetReaded = true;
        }
        this.overlay.presentToast('成功添加新好友！');
      }

      // 更新一下聊天列表
      this.onChatService.initChatSession().subscribe();

      // 更新好友列表
      // 如果为空才更新，因为为空时，进入好友列表页会自动查询
      this.globalData.privateChatrooms.length && this.apiService.getPrivateChatrooms().pipe(
        filter(({ code }: Result) => code === ResultCode.Success)
      ).subscribe(({ data }: Result<ChatSession[]>) => {
        this.globalData.privateChatrooms = data;
      });
    });

    // 拒绝好友申请/收到拒绝好友申请
    this.socketService.on(SocketEvent.FriendRequestReject).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(({ data }: Result<FriendRequest>) => {
      const { user } = this.globalData;
      // 如果申请人是自己
      if (data.requesterId === user.id) {
        const index = this.globalData.sendFriendRequests.findIndex(o => o.id === data.id);
        if (index >= 0) {
          this.globalData.sendFriendRequests[index] = data;
        } else {
          this.globalData.sendFriendRequests.unshift(data);
        }

        this.overlay.presentNotification({
          icon: data.targetAvatarThumbnail,
          title: '好友申请被拒绝',
          description: '用户 ' + data.targetNickname + ' 拒绝了你的好友申请',
          url: '/friend/request/' + data.targetId
        });
        this.feedbackService.playAudio(AudioName.DingDeng);
      } else if (data.targetId === user.id) { // 如果自己是被申请人
        const index = this.globalData.receiveFriendRequests.findIndex(o => o.id === data.id);
        if (index >= 0) {
          this.globalData.receiveFriendRequests[index] = data;
        } else {
          this.globalData.receiveFriendRequests.unshift(data);
        }

        this.overlay.presentToast('已拒绝该好友申请！');
      }
    });

    // 收到消息时
    this.socketService.on(SocketEvent.Message).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(({ data }: Result<Message>) => {
      const { chatroomId, user } = this.globalData;
      // 先去聊天列表缓存里面查，看看有没有这个房间的数据
      const chatSession = this.globalData.chatSessions.find(o => o.data.chatroomId === data.chatroomId);

      // 如果消息不是自己的话，就播放提示音
      if (data.userId !== user.id) {
        const chatroomName = chatSession ? chatSession.title : '收到新消息';
        const content = this.messageDescPipe.transform(data);

        // 并且不在同一个房间，就弹出通知
        if (data.chatroomId !== chatroomId || this.document.hidden) {
          this.overlay.presentNotification({
            icon: chatSession ? chatSession.avatarThumbnail : data.avatarThumbnail,
            title: chatroomName,
            description: (chatroomName !== data.nickname ? data.nickname + '：' : '') + content,
            url: '/chat/' + data.chatroomId
          });
        }

        this.feedbackService.playAudio(AudioName.Boo);
      }

      if (chatSession) {
        // 如果用户已经进入消息所属房间
        if (chatroomId === data.chatroomId) {
          chatSession.unread = 0;
        } else if (data.userId !== user.id) {
          chatSession.unread++;
        }

        chatSession.content = data;
        chatSession.updateTime = Date.now();
        this.globalData.sortChatSessions();
      } else { // 如果不存在于列表当中，就刷新数据
        this.onChatService.initChatSession().subscribe();
      }
    });

    // 撤回消息时
    this.socketService.on(SocketEvent.RevokeMessage).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(({ data }: Result<{ chatroomId: number, msgId: number }>) => {
      // 收到撤回消息的信号，去聊天列表里面找，找的到就更新一下，最新消息
      const chatSession = this.globalData.chatSessions.find(o => o.data.chatroomId === data.chatroomId);
      if (chatSession) {
        const nickname = chatSession.content.userId === this.globalData.user.id ? '我' : chatSession.content.nickname;
        chatSession.unread && chatSession.unread--;
        chatSession.content.nickname = nickname;
        chatSession.content.type = MessageType.Tips;
        chatSession.content.data = new RevokeMessageTipsMessage();
        chatSession.content = { ...chatSession.content };
        chatSession.updateTime = Date.now();
        this.globalData.sortChatSessions();
      }
    });

    // 收到入群申请时
    this.socketService.on(SocketEvent.ChatRequest).pipe(
      filter(({ code, data }: Result<ChatRequest>) => {
        // 如果申请人不是自己
        return code === ResultCode.Success && data?.requesterId !== this.globalData.user.id;
      })
    ).subscribe(({ data }: Result<ChatRequest>) => {
      const chatSession = this.globalData.chatSessions.find(o => o.type === ChatSessionType.ChatroomNotice);
      // 如果列表里没有聊天室通知会话,就需要重新拉取
      if (!chatSession) {
        return this.onChatService.initChatSession().subscribe(() => {
          this.feedbackService.playAudio(AudioName.Boo);
        });
      }

      const index = this.globalData.receiveChatRequests.findIndex(o => o.id === data.id);

      if (index >= 0) {
        this.globalData.receiveChatRequests[index] = data;
        this.globalData.sortReceiveChatRequests();
      } else {
        this.globalData.receiveChatRequests.unshift(data);
        this.feedbackService.playAudio(AudioName.Boo);
      }

      chatSession.updateTime = Date.now();
      this.globalData.sortChatSessions();
    });

    // 同意别人入群/同意我入群
    this.socketService.on(SocketEvent.ChatRequestAgree).subscribe(({ code, data, msg }: Result<[ChatRequest, ChatSession]>) => {
      const { user } = this.globalData;

      if (code !== ResultCode.Success) {
        return this.overlay.presentToast('操作失败，原因：' + msg);
      }

      const [request, chatSession] = data;

      // 清除这个聊天室成员的缓存
      this.cacheService.revoke('/chatroom/' + request.chatroomId + '/members?');

      // 如果是同意我入群
      if (chatSession.userId === user.id) {
        this.overlay.presentNotification({
          icon: chatSession.avatarThumbnail,
          title: '聊天室申请加入成功',
          description: '你已加入 ' + chatSession.title,
          url: '/chatroom/' + chatSession.data.chatroomId
        });

        this.feedbackService.playAudio(AudioName.Boo);

        const index = this.globalData.sendChatRequests.findIndex(o => o.id === request.id);
        if (index >= 0) {
          this.globalData.sendChatRequests[index] = request;
        }

        this.globalData.chatSessions.push(chatSession);
        return this.globalData.sortChatSessions();
      }

      // 同意别人入群
      const index = this.globalData.receiveChatRequests.findIndex(o => o.id === request.id);
      if (index >= 0) {
        this.globalData.receiveChatRequests[index] = request;
      }

      // 如果我是处理人
      if (request.handlerId === user.id) {
        this.overlay.presentToast('操作成功，已同意该申请！');
        this.navCtrl.back();
      }
    });

    // 拒绝别人的入群申请/入群申请被拒绝
    this.socketService.on(SocketEvent.ChatRequestReject).subscribe(({ code, data, msg }: Result<ChatRequest>) => {
      const { user } = this.globalData;

      if (code !== ResultCode.Success) {
        return this.overlay.presentToast('操作失败，原因：' + msg);
      }

      // 如果我是申请人，我被拒绝了
      if (data.requesterId === user.id) {
        const index = this.globalData.sendChatRequests.findIndex(o => o.id === data.id);
        if (index >= 0) {
          this.globalData.sendChatRequests[index] = data;
        }

        this.overlay.presentNotification({
          icon: data.chatroomAvatarThumbnail,
          title: '聊天室申请加入失败',
          description: data.handlerNickname + ' 拒绝让你加入 ' + data.chatroomName,
          url: '/chatroom/request/' + data.id
        });
        return this.feedbackService.playAudio(AudioName.Boo);
      }

      // 如果处理人是我自己
      const index = this.globalData.receiveChatRequests.findIndex(o => o.id === data.id);
      if (index >= 0) {
        this.globalData.receiveChatRequests[index] = data;
      }
      this.overlay.presentToast('操作成功，已拒绝该申请！');
    });

    this.appService.detectUpdate();
    this.appService.detectNavigation();
    this.appService.detectSocketConnectStatus();
    this.appService.initNotification();
  }

}
