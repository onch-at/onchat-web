import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SessionStorageKey } from 'src/app/common/enum';
import { AvatarCropperComponent } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { Result, User } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
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
    public globalDataService: GlobalDataService,
    private overlayService: OverlayService,
    private feedbackService: FeedbackService,
    private sessionStorageService: SessionStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User }) => {
      if ((data.user as User).id) {
        this.user = data.user as User;
      } else if ((data.user as Result<User>).code == 0) {
        this.user = (data.user as Result<User>).data;
        this.sessionStorageService.setItemToMap(
          SessionStorageKey.UserMap,
          this.user.id,
          this.user
        );
      } else {
        this.overlayService.presentToast('用户不存在！');
        this.router.navigate(['/']);
      }
    });
  }

  onPress() {
    this.feedbackService.vibrate();
    this.presentActionSheet();
  }

  presentActionSheet() {
    const buttons = [
      { text: '保存图片', handler: () => SysUtil.downLoadFile(this.user.avatar) },
      { text: '取消', role: 'cancel' }
    ];

    // 如果是自己的头像
    (this.globalDataService.user && this.user.id == this.globalDataService.user.id) && buttons.unshift({
      text: '更换头像',
      handler: () => SysUtil.uploadFile('image/*').then((event: Event) => this.modalController.create({
        component: AvatarCropperComponent,
        componentProps: {
          imageChangedEvent: event
        }
      })).then((modal: HTMLIonModalElement) => {
        modal.present();
        modal.onWillDismiss().then((e: { data: SafeUrl }) => {
          if (e.data) {
            this.user.avatar = e.data as string;
          }
        });
      })
    });

    this.overlayService.presentActionSheet(undefined, buttons);
  }

}
