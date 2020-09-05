import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SessionStorageKey } from 'src/app/common/enum';
import { AvatarCropperComponent } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { Result, User } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { OnChatService } from 'src/app/services/onchat.service';
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
    public onChatService: OnChatService,
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
    if (!this.onChatService.user || this.user.id != this.onChatService.user.id) {
      return;
    }

    const handler = async () => {
      SysUtil.uploadFile('image/*').then((event: Event) => this.modalController.create({
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
      });
    };

    this.overlayService.presentActionSheet(undefined, [
      { text: '更换头像', handler },
      { text: '取消' }
    ]);
  }

}
