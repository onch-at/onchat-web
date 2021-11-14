import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { of } from 'rxjs';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ChatMemberRole, ResultCode, SocketEvent } from 'src/app/common/enums';
import { ChatSessionCheckbox, SafeAny } from 'src/app/common/interfaces';
import { AvatarCropperComponent, AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { ChatMemberListComponent } from 'src/app/components/modals/chat-member-list/chat-member-list.component';
import { ChatSessionSelectorComponent } from 'src/app/components/modals/chat-session-selector/chat-session-selector.component';
import { CHATROOM_NAME_MAX_LENGTH, MSG_BROADCAST_QUANTITY_LIMIT, NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/constants';
import { ChatMember, ChatRequest, Chatroom, ChatSession, Result } from 'src/app/models/onchat.model';
import { ChatroomService } from 'src/app/services/apis/chatroom.service';
import { UserService } from 'src/app/services/apis/user.service';
import { CacheService } from 'src/app/services/cache.service';
import { Destroyer } from 'src/app/services/destroyer.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtils } from 'src/app/utilities/str.utils';
import { SysUtils } from 'src/app/utilities/sys.utils';

@Component({
  selector: 'app-chatroom-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [Destroyer]
})
export class HomePage implements OnInit {
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
    private chatroomService: ChatroomService,
    private userService: UserService,
    private cacheService: CacheService,
    private socketService: SocketService,
    private routerOutlet: IonRouterOutlet,
    private destroyer: Destroyer,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ chatroom, chatMembers }: { chatroom: Result<Chatroom>, chatMembers: Result<ChatMember[]> }) => {
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
      takeUntil(this.destroyer),
      debounceTime(100)
    ).subscribe(({ code, data, msg }: Result<ChatRequest>) => {
      if (code !== ResultCode.Success) {
        return this.overlay.toast('申请失败，原因：' + msg);
      }

      if (data.requesterId === this.globalData.user.id) {
        this.overlay.toast('入群申请已发出，等待管理员处理…');

        const index = this.globalData.sendChatRequests.findIndex(o => o.id === data.id);
        if (index >= 0) {
          this.globalData.sendChatRequests[index] = data;
        } else {
          this.globalData.sendChatRequests.unshift(data);
        }
      }
    });
  }

  presentChatMemberList() {
    this.overlay.modal({
      component: ChatMemberListComponent,
      componentProps: {
        chatMembers: this.members
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

  changeChatroomName() {
    this.overlay.alert({
      header: '聊天室名称',
      confirmHandler: (data: KeyValue<string, any>) => {
        const { id, name } = this.chatroom;
        if (!StrUtils.trimAll(data['name']).length || data['name'] === name) { return; }

        this.chatroomService.setName(id, data['name']).subscribe(() => {
          this.chatroom.name = data['name'];
          this.overlay.toast('成功修改聊天室名称！', 1000);
          this.cacheService.revoke('/chatroom/' + id);

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
    this.overlay.alert({
      header: '我的昵称',
      confirmHandler: (data: KeyValue<string, any>) => {
        if (data['nickname'] === this.member.nickname) { return; }

        this.chatroomService.setMemberNickname(this.chatroom.id, data['nickname']).subscribe(({ data }: Result<string>) => {
          const member = this.members.find(o => o.userId === this.globalData.user.id);
          member.nickname = data;
          this.member.nickname = data;
          this.overlay.toast('成功修改我的昵称！', 1000);
          this.cacheService.revoke('/chatroom/' + this.chatroom.id + '/members');
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
    this.overlay.alert({
      header: '申请加入',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.chatRequset(this.chatroom.id, StrUtils.trimAll(data['reason']).length ? data['reason'] : undefined);
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

  onScroll({ detail }: SafeAny) {
    this.showMask = detail.scrollTop > 200;
  }

  /**
   * 邀请好友入群
   */
  inviteJoinChatroom() {
    // 等待加载出好友会话后的一个可观察对象
    const observable = this.globalData.privateChatrooms ? of(null) : this.userService.getPrivateChatrooms().pipe(
      tap(({ data }: Result<ChatSession[]>) => {
        this.globalData.privateChatrooms = data;
      })
    );

    observable.subscribe(() => this.overlay.modal({
      component: ChatSessionSelectorComponent,
      componentProps: {
        title: '邀请好友',
        // 筛选出不在这个聊天室的好友会话
        chatSessions: this.globalData.privateChatrooms.filter(o => !this.members.some(p => p.userId === o.data.userId)).map(o => ({ ...o, checked: false })),
        limit: MSG_BROADCAST_QUANTITY_LIMIT,
        handler: (data: ChatSessionCheckbox[]) => {
          const observable = this.socketService.on(SocketEvent.InviteJoinChatroom).pipe(
            switchMap(({ code, msg }: Result<number[]>) => {
              this.overlay.toast(code === ResultCode.Success ? '邀请消息已发出！' : '邀请失败，原因：' + msg);
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
      text: '更换头像', handler: () => SysUtils.selectFile('image/*').subscribe((event: Event) => this.overlay.modal({
        component: AvatarCropperComponent,
        componentProps: {
          imageChangedEvent: event,
          uploader: (avatar: File) => this.chatroomService.avatar(this.chatroom.id, avatar),
          handler: ({ data }: Result<AvatarData>) => {
            const { avatar, avatarThumbnail } = data;
            const id = this.chatroom.id;
            this.chatroom.avatar = avatar;
            this.chatroom.avatarThumbnail = avatarThumbnail;
            this.cacheService.revoke('/chatroom/' + id);
            const chatSession = this.globalData.chatSessions.find(o => o.data.chatroomId === id);
            if (chatSession) {
              chatSession.avatarThumbnail = avatarThumbnail;
            }
          }
        }
      }))
    });

    this.overlay.actionSheet(buttons);
  }

}
