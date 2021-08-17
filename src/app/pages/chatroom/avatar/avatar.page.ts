import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ResultCode } from 'src/app/common/enum';
import { Chatroom, Result } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SysUtil } from 'src/app/utils/sys.util';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.page.html',
  styleUrls: ['./avatar.page.scss'],
})
export class AvatarPage implements OnInit {
  /** 聊天室 */
  chatroom: Chatroom;
  /** swiperjs options: https://swiperjs.com/api/ */
  slideOpts: SwiperOptions = {
    initialSlide: 0,
    zoom: {
      maxRatio: 3,
      minRatio: 0.75,
      toggle: true
    }
  };

  constructor(
    private overlay: Overlay,
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ chatroom }: { chatroom: Result<Chatroom> }) => {
      const { code, data } = chatroom;
      if (code !== ResultCode.Success) {
        this.overlay.presentToast('聊天室不存在！');
        return this.navCtrl.back();
      }

      this.chatroom = data;
    });
  }

  onPress() {
    this.feedbackService.slightVibrate();
    this.presentActionSheet();
  }

  presentActionSheet() {
    const buttons = [
      { text: '保存图片', handler: () => SysUtil.downloadFile(this.chatroom.avatar) },
      { text: '取消', role: 'cancel' }
    ];

    this.overlay.presentActionSheet(buttons);
  }

}
