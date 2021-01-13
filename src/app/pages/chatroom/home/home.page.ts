import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ChatMemberRole, ResultCode, SocketEvent } from 'src/app/common/enum';
import { AvatarCropperComponent, AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { ChatMember, ChatRequest, Chatroom, Result } from 'src/app/models/onchat.model';
import { CacheService } from 'src/app/services/cache.service';
import { GlobalDataService } from 'src/app/services/global-data.service';
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
  subject: Subject<unknown> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalDataService: GlobalDataService,
    private overlayService: OverlayService,
    private onChatService: OnChatService,
    private cacheService: CacheService,
    private socketService: SocketService,
    private modalController: ModalController,
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
      this.chatMembers = [...(host ? [host] : []), ...managers, ...normalMembers].splice(0, 6);
      this.memberCount = chatMembers.length;

      // 从群成员里面找自己
      const member = chatMembers.find(o => o.userId === this.globalDataService.user.id);

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

      if (data.applicantId === this.globalDataService.user.id) {
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

  presentActionSheet() {
    const buttons = [
      {
        text: '查看头像', handler: () => {
          this.router.navigate(['/chatroom/avatar', this.chatroom.id]);
        }
      },
      { text: '取消', role: 'cancel' }
    ];

    // 如果是群主、管理员
    (this.isHost || this.isManager) && buttons.unshift({
      text: '更换头像', handler: () => SysUtil.uploadFile('image/*').then((event: Event) => this.modalController.create({
        component: AvatarCropperComponent,
        componentProps: {
          imageChangedEvent: event,
          uploader: (avatar: Blob) => this.onChatService.uploadChatroomAvatar(this.chatroom.id, avatar),
          handler: (result: Result<AvatarData>) => {
            const { avatar, avatarThumbnail } = result.data;
            const id = this.chatroom.id;
            this.chatroom.avatar = avatar;
            this.chatroom.avatarThumbnail = avatarThumbnail;
            this.cacheService.revoke(new RegExp('/chatroom/' + id + '?'));
            const chatSession = this.globalDataService.chatSessions.find(o => o.data.chatroomId === id);
            if (chatSession) {
              chatSession.avatarThumbnail = avatarThumbnail;
            }
          }
        }
      })).then(modal => modal.present())
    });

    this.overlayService.presentActionSheet(undefined, buttons);
  }

}
