import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, first, takeUntil, tap } from 'rxjs/operators';
import { ChatMemberRole, ResultCode, SocketEvent } from 'src/app/common/enum';
import { ChatSessionCheckbox } from 'src/app/common/interface';
import { AvatarCropperComponent, AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { ChatSessionSelectorComponent } from 'src/app/components/modals/chat-session-selector/chat-session-selector.component';
import { ChatMember, ChatRequest, Chatroom, ChatSession, Result } from 'src/app/models/onchat.model';
import { CacheService } from 'src/app/services/cache.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-chatroom-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  chatroom: Chatroom;
  chatMembers: ChatMember[];
  /** 是否是聊天室主人 */
  isHost: boolean;
  /** 是否是聊天室管理者 */
  isManager: boolean;
  /** 是否是聊天室成员 */
  isMember: boolean;
  /** 成员数量 */
  memberCount: number;
  showMask: boolean;
  private subject: Subject<unknown> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalData: GlobalData,
    private overlayService: OverlayService,
    private onChatService: OnChatService,
    private cacheService: CacheService,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatroom: Result<Chatroom>, chatMembers: Result<ChatMember[]> }) => {
      if (data.chatroom.code !== ResultCode.Success) {
        this.overlayService.presentToast('聊天室不存在！');
        return this.router.navigateByUrl('/');
      }

      this.chatroom = data.chatroom.data;
      const chatMembers = data.chatMembers.data;
      const host = chatMembers.find(o => o.role === ChatMemberRole.Host);
      const managers = chatMembers.filter(o => o.role === ChatMemberRole.Manage);
      const normalMembers = chatMembers.filter(o => o.role === ChatMemberRole.Normal);
      // 按照群主>管理员>普通成员排列
      this.chatMembers = [...(host ? [host] : []), ...managers, ...normalMembers];
      this.memberCount = chatMembers.length;

      // 从群成员里面找自己
      const member = chatMembers.find(o => o.userId === this.globalData.user.id);

      this.isMember = !!member;

      if (member) {
        this.isHost = member.role === ChatMemberRole.Host;
        this.isManager = member.role === ChatMemberRole.Manage;
      }
    });

    this.socketService.on(SocketEvent.ChatRequest).pipe(
      takeUntil(this.subject),
      debounceTime(100)
    ).subscribe((result: Result<ChatRequest>) => {
      const { code, data, msg } = result;

      if (code !== ResultCode.Success) {
        return this.overlayService.presentToast('申请失败，原因：' + msg);
      }

      if (data.applicantId === this.globalData.user.id) {
        this.overlayService.presentToast('入群申请已发出，等待管理员处理…');
      }
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  /**
   * 申请加入群聊
   */
  request() {
    this.overlayService.presentAlert({
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
            maxlength: 50
          }
        }
      ]
    });
  }

  onScroll(event: any) {
    this.showMask = event.detail.scrollTop > 200;
  }

  getArr(length: number) {
    return new Array(length).fill('');
  }

  /**
   * 邀请好友入群
   */
  inviteJoinChatroom() {
    // 等待加载出好友会话后的一个可观察对象
    const observable: Observable<ChatSession[] | Result<ChatSession[]>> = this.globalData.privateChatrooms.length ?
      of(null) : this.onChatService.getPrivateChatrooms().pipe(
        filter((result: Result) => result.code === ResultCode.Success),
        tap((result: Result<ChatSession[]>) => {
          this.globalData.privateChatrooms = result.data;
        })
      );

    observable.subscribe(() => this.overlayService.presentModal({
      component: ChatSessionSelectorComponent,
      componentProps: {
        title: '邀请好友',
        // 筛选出不在这个聊天室的好友会话
        chatSessions: this.globalData.privateChatrooms.filter(o => !this.chatMembers.some(p => p.userId === o.data.userId)).map(o => ({ ...o, checked: false })),
        limit: 30,
        handler: (data: ChatSessionCheckbox[]) => {
          // 得到聊天室ID
          const list = data.map(o => o.data.chatroomId);
          const observable = new Observable(observer => {
            this.socketService.on(SocketEvent.InviteJoinChatroom).pipe(
              first(),
              takeUntil(this.subject),
            ).subscribe((result: Result<number[]>) => {
              const { code, msg } = result;
              this.overlayService.presentToast(code === ResultCode.Success ? '邀请消息已发出！' : '邀请失败，原因：' + msg);
              observer.next();
              observer.complete();
            });
          });

          this.socketService.inviteJoinChatroom(this.chatroom.id, list);

          return observable;
        }
      }
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
      text: '更换头像', handler: () => SysUtil.uploadFile('image/*').then((event: Event) => this.overlayService.presentModal({
        component: AvatarCropperComponent,
        componentProps: {
          imageChangedEvent: event,
          uploader: (avatar: Blob) => this.onChatService.uploadChatroomAvatar(this.chatroom.id, avatar),
          handler: (result: Result<AvatarData>) => {
            const { avatar, avatarThumbnail } = result.data;
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

    this.overlayService.presentActionSheet(buttons);
  }

}
