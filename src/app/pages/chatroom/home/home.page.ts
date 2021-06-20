import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { of, Subject } from 'rxjs';
import { debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CHATROOM_NAME_MAX_LENGTH, MSG_BROADCAST_QUANTITY_LIMIT, NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/common/constant';
import { ChatMemberRole, ResultCode, SocketEvent } from 'src/app/common/enum';
import { ChatSessionCheckbox } from 'src/app/common/interface';
import { AvatarCropperComponent, AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { ChatMemberListComponent } from 'src/app/components/modals/chat-member-list/chat-member-list.component';
import { ChatSessionSelectorComponent } from 'src/app/components/modals/chat-session-selector/chat-session-selector.component';
import { ChatMember, ChatRequest, Chatroom, ChatSession, Result } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { CacheService } from 'src/app/services/cache.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-chatroom-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  chatroom: Chatroom;
  members: ChatMember[];
  /** 在群成员中的我 */
  member: ChatMember;
  /** 是否是聊天室主人 */
  isHost: boolean;
  /** 是否是聊天室管理者 */
  isManager: boolean;
  /** 是否是聊天室成员 */
  isMember: boolean;
  showMask: boolean;

  constructor(
    public globalData: GlobalData,
    private router: Router,
    private overlay: Overlay,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private navCtrl: NavController,
    private cacheService: CacheService,
    private socketService: SocketService,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ chatroom, chatMembers }: { chatroom: Result<Chatroom>, chatMembers: Result<ChatMember[]> }) => {
      if (chatroom.code !== ResultCode.Success) {
        this.overlay.presentToast('聊天室不存在！');
        return this.navCtrl.back();
      }

      this.chatroom = chatroom.data;
      const members = chatMembers.data;
      const host = members.find(o => o.role === ChatMemberRole.Host);
      const managers = members.filter(o => o.role === ChatMemberRole.Manage);
      const normalMembers = members.filter(o => o.role === ChatMemberRole.Normal);
      // 按照群主>管理员>普通成员排列
      this.members = [...(host ? [host] : []), ...managers, ...normalMembers];

      // 从群成员里面找自己
      this.member = members.find(o => o.userId === this.globalData.user.id);

      this.isMember = !!this.member;

      if (this.member) {
        this.isHost = this.member.role === ChatMemberRole.Host;
        this.isManager = this.member.role === ChatMemberRole.Manage;
      }
    });

    this.socketService.on(SocketEvent.ChatRequest).pipe(
      takeUntil(this.destroy$),
      debounceTime(100)
    ).subscribe(({ code, data, msg }: Result<ChatRequest>) => {
      if (code !== ResultCode.Success) {
        return this.overlay.presentToast('申请失败，原因：' + msg);
      }

      if (data.requesterId === this.globalData.user.id) {
        this.overlay.presentToast('入群申请已发出，等待管理员处理…');

        const index = this.globalData.sendChatRequests.findIndex(o => o.id === data.id);
        if (index >= 0) {
          this.globalData.sendChatRequests[index] = data;
        } else {
          this.globalData.sendChatRequests.unshift(data);
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  presentChatMemberList() {
    this.overlay.presentModal({
      component: ChatMemberListComponent,
      componentProps: {
        chatMembers: this.members
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

  changeChatroomName() {
    this.overlay.presentAlert({
      header: '聊天室名称',
      confirmHandler: (data: KeyValue<string, any>) => {
        const { id, name } = this.chatroom;
        if (!StrUtil.trimAll(data['name']).length || data['name'] === name) { return; }

        this.apiService.setChatroomName(id, data['name']).subscribe(({ code, msg }: Result) => {
          if (code !== ResultCode.Success) {
            return this.overlay.presentToast(msg);
          }

          this.chatroom.name = data['name'];
          this.overlay.presentToast('成功修改聊天室名称！', 1000);
          this.cacheService.revoke('/chatroom/' + id + '?');

          const chatSession = this.globalData.chatSessions.find(o => o.data.chatroomId === id);
          if (chatSession) {
            chatSession.title = data['name'];
          }
        });
      },
      inputs: [{
        name: 'name',
        type: 'text',
        value: this.chatroom.name,
        placeholder: '聊天室名称',
        cssClass: 'ipt-primary',
        attributes: {
          maxlength: CHATROOM_NAME_MAX_LENGTH,
          required: true
        }
      }]
    });
  }

  changeNickname() {
    this.overlay.presentAlert({
      header: '我的昵称',
      confirmHandler: (data: KeyValue<string, any>) => {
        if (data['nickname'] === this.member.nickname) { return; }

        this.apiService.setMemberNickname(this.chatroom.id, data['nickname']).subscribe(({ code, data, msg }: Result<string>) => {
          if (code !== ResultCode.Success) {
            return this.overlay.presentToast(msg);
          }

          const member = this.members.find(o => o.userId === this.globalData.user.id);
          member.nickname = data;
          this.member.nickname = data;
          this.overlay.presentToast('成功修改我的昵称！', 1000);
          this.cacheService.revoke('/chatroom/' + this.chatroom.id + '/members?');
        });
      },
      inputs: [{
        name: 'nickname',
        type: 'text',
        value: this.member.nickname,
        placeholder: '我的昵称',
        cssClass: 'ipt-primary',
        attributes: {
          maxlength: NICKNAME_MAX_LENGTH,
          required: true
        }
      }]
    });
  }

  /**
   * 申请加入群聊
   */
  request() {
    this.overlay.presentAlert({
      header: '申请加入',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.chatRequset(this.chatroom.id, StrUtil.trimAll(data['reason']).length ? data['reason'] : undefined);
      },
      inputs: [
        {
          name: 'reason',
          type: 'textarea',
          placeholder: '可以告诉他们你的申请原因',
          cssClass: 'ipt-primary',
          attributes: {
            rows: 4,
            maxlength: REASON_MAX_LENGTH
          }
        }
      ]
    });
  }

  onScroll({ detail }: any) {
    this.showMask = detail.scrollTop > 200;
  }

  /**
   * 邀请好友入群
   */
  inviteJoinChatroom() {
    // 等待加载出好友会话后的一个可观察对象
    const observable = this.globalData.privateChatrooms ? of(null) : this.apiService.getPrivateChatrooms().pipe(
      filter(({ code }: Result) => code === ResultCode.Success),
      tap(({ data }: Result<ChatSession[]>) => {
        this.globalData.privateChatrooms = data;
      })
    );

    observable.subscribe(() => this.overlay.presentModal({
      component: ChatSessionSelectorComponent,
      componentProps: {
        title: '邀请好友',
        // 筛选出不在这个聊天室的好友会话
        chatSessions: this.globalData.privateChatrooms.filter(o => !this.members.some(p => p.userId === o.data.userId)).map(o => ({ ...o, checked: false })),
        limit: MSG_BROADCAST_QUANTITY_LIMIT,
        handler: (data: ChatSessionCheckbox[]) => {
          const observable = this.socketService.on(SocketEvent.InviteJoinChatroom).pipe(
            switchMap(({ code, msg }: Result<number[]>) => {
              this.overlay.presentToast(code === ResultCode.Success ? '邀请消息已发出！' : '邀请失败，原因：' + msg);
              return of(null);
            })
          );

          // 得到聊天室ID
          const list = data.map(o => o.data.chatroomId);
          this.socketService.inviteJoinChatroom(this.chatroom.id, list);

          return observable;
        }
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    }));
  }

  presentActionSheet() {
    const buttons = [
      {
        text: '查看头像', handler: () => {
          this.router.navigate(['/chatroom/avatar', this.chatroom.id]);
        }
      },
      {
        text: '取消',
        role: 'cancel'
      }
    ];

    // 如果是群主、管理员
    (this.isHost || this.isManager) && buttons.unshift({
      text: '更换头像', handler: () => SysUtil.selectFile('image/*').subscribe((event: Event) => this.overlay.presentModal({
        component: AvatarCropperComponent,
        componentProps: {
          imageChangedEvent: event,
          uploader: (avatar: Blob) => this.apiService.uploadChatroomAvatar(this.chatroom.id, avatar),
          handler: ({ data }: Result<AvatarData>) => {
            const { avatar, avatarThumbnail } = data;
            const id = this.chatroom.id;
            this.chatroom.avatar = avatar;
            this.chatroom.avatarThumbnail = avatarThumbnail;
            this.cacheService.revoke('/chatroom/' + id + '?');
            const chatSession = this.globalData.chatSessions.find(o => o.data.chatroomId === id);
            if (chatSession) {
              chatSession.avatarThumbnail = avatarThumbnail;
            }
          }
        }
      }))
    });

    this.overlay.presentActionSheet(buttons);
  }

}
