import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ImageMessage } from 'src/app/models/form.model';
import { IEntity, Message } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SysUtil } from 'src/app/utils/sys.util';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-image-previewer',
  templateUrl: './image-previewer.component.html',
  styleUrls: ['./image-previewer.component.scss'],
})
export class ImagePreviewerComponent extends ModalComponent {
  @Input() data: Message[] = [];
  @Input() index: number;
  /** swiperjs options: https://swiperjs.com/api/ */
  slideOpts = {
    initialSlide: null,
    zoom: {
      maxRatio: 3,
      minRatio: 0.75,
      toggle: true
    }
  };

  constructor(
    private feedbackService: FeedbackService,
    protected overlayService: OverlayService,
    protected router: Router
  ) {
    super(router, overlayService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.slideOpts.initialSlide = this.index;
  }

  onPress(item: Message) {
    this.feedbackService.slightVibrate();
    this.presentActionSheet(item);
  }

  presentActionSheet(item: Message) {
    this.overlayService.presentActionSheet([
      { text: '保存图片', handler: () => SysUtil.downLoadFile((item.data as ImageMessage).url) },
      { text: '取消', role: 'cancel' }
    ]);
  }

  /**
   * 用于提升性能
   * 一般情况下，当数组内有变更时，
   * Angular将会对整个DOM树加以重新渲染。
   * 如果加上trackBy方法，Angular将会知道具体的变更元素，
   * 并针对性地对此特定元素进行DOM刷新，提升页面渲染性能。
   */
  trackByFn(index: number, item: IEntity): number {
    return item.id;
  }

}
