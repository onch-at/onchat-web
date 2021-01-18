import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ResultCode } from 'src/app/common/enum';
import { AvatarCropperComponent, AvatarData } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { Result, User } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage implements OnInit {
  /** 用户 */
  user: User;
  /** swiperjs options: https://swiperjs.com/api/ */
  slideOpts = {
    initialSlide: 1,
    zoom: {
      maxRatio: 3,
      minRatio: 0.75,
      toggle: true
    }
  };

  constructor(
    public globalData: GlobalData,
    private overlayService: OverlayService,
    private onChatService: OnChatService,
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User }) => {
      if ((data.user as User).id) {
        this.user = data.user as User;
      } else if ((data.user as Result<User>).code === ResultCode.Success) {
        this.user = (data.user as Result<User>).data;
      } else {
        this.overlayService.presentToast('用户不存在！');
        this.router.navigateByUrl('/');
      }
    });
  }

  onPress() {
    this.feedbackService.slightVibrate();
    this.presentActionSheet();
  }

  presentActionSheet() {
    const buttons = [
      { text: '保存图片', handler: () => SysUtil.downLoadFile(this.user.avatar) },
      { text: '取消', role: 'cancel' }
    ];

    // 如果是自己的头像
    (this.user.id == this.globalData.user?.id) && buttons.unshift({
      text: '更换头像',
      handler: () => SysUtil.uploadFile('image/*').then((event: Event) => this.overlayService.presentModal({
        component: AvatarCropperComponent,
        componentProps: {
          imageChangedEvent: event,
          uploader: (avatar: Blob) => this.onChatService.uploadUserAvatar(avatar),
          handler: (result: Result<AvatarData>) => {
            const { avatar, avatarThumbnail } = result.data;
            this.user.avatar = avatar;
            this.globalData.user.avatar = avatar;
            this.globalData.user.avatarThumbnail = avatarThumbnail;
          }
        }
      }))
    });

    this.overlayService.presentActionSheet(buttons);
  }

}
