import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AvatarCropperComponent, AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { Result, User } from 'src/app/models/onchat.model';
import { UserService } from 'src/app/services/apis/user.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SysUtil } from 'src/app/utils/sys.util';
import Swiper, { Zoom } from 'swiper';
import { ZoomOptions } from 'swiper/types';

Swiper.use([Zoom]);

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage implements OnInit {
  /** 用户 */
  user: User;

  zoom: ZoomOptions = {
    maxRatio: 5,
    minRatio: 0.75,
    toggle: true
  };

  constructor(
    public globalData: GlobalData,
    private overlay: Overlay,
    private userService: UserService,
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ user }: { user: User }) => {
      if (user) {
        this.user = user;
      } else {
        this.overlay.toast('用户不存在！');
        this.navCtrl.back();
      }
    });
  }

  onPress() {
    this.feedbackService.slightVibrate();
    this.presentActionSheet();
  }

  presentActionSheet() {
    const buttons = [
      { text: '保存图片', handler: () => { SysUtil.downloadFile(this.user.avatar) } },
      { text: '取消', role: 'cancel' }
    ];

    // 如果是自己的头像
    (this.user.id === this.globalData.user?.id) && buttons.unshift({
      text: '更换头像',
      handler: () => SysUtil.selectFile('image/*').subscribe((event: Event) => this.overlay.modal({
        component: AvatarCropperComponent,
        componentProps: {
          imageChangedEvent: event,
          uploader: (avatar: Blob) => this.userService.avatar(avatar),
          handler: ({ data }: Result<AvatarData>) => {
            const { avatar, avatarThumbnail } = data;
            this.user.avatar = avatar;
            this.globalData.user.avatar = avatar;
            this.globalData.user.avatarThumbnail = avatarThumbnail;
          }
        }
      }))
    });

    this.overlay.actionSheet(buttons);
  }

}
