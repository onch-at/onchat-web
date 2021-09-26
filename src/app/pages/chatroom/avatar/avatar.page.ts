import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chatroom, Result } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
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
  /** 聊天室 */
  chatroom: Chatroom;

  zoom: ZoomOptions = {
    maxRatio: 5,
    minRatio: 0.75,
    toggle: true
  };

  constructor(
    private overlay: Overlay,
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ chatroom }: { chatroom: Result<Chatroom> }) => {
      this.chatroom = chatroom.data;
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

    this.overlay.actionSheet(buttons);
  }

}
