import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ChatMemberRole, ResultCode } from 'src/app/common/enum';
import { AvatarCropperComponent, AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { ChatMember, Chatroom, Result } from 'src/app/models/onchat.model';
import { CacheService } from 'src/app/services/cache.service';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalDataService: GlobalDataService,
    private overlayService: OverlayService,
    private onChatService: OnChatService,
    private cacheService: CacheService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatroom: Result<Chatroom>, chatMembers: Result<ChatMember[]> }) => {
      if (data.chatroom.code !== ResultCode.Success) {
        this.overlayService.presentToast('聊天室不存在！');
        return this.router.navigate(['/']);
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
  }

  onScroll(event: any) {
    this.showMask = event.detail.scrollTop > 175;
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
            const chatItem = this.globalDataService.chatList.find(o => o.chatroomId === id);
            if (chatItem) {
              chatItem.avatarThumbnail = avatarThumbnail;
            }
          }
        }
      })).then(modal => modal.present())
    });

    this.overlayService.presentActionSheet(undefined, buttons);
  }

}
