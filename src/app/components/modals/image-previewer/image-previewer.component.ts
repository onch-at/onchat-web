import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetButton } from 'src/app/common/interface';
import { ImageMessage } from 'src/app/models/form.model';
import { IEntity, Message } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SysUtil } from 'src/app/utils/sys.util';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Lazy, Zoom } from 'swiper/core';
import { ZoomOptions } from 'swiper/types';
import { ModalComponent } from '../modal.component';

SwiperCore.use([Lazy, Zoom]);

@Component({
  selector: 'app-image-previewer',
  templateUrl: './image-previewer.component.html',
  styleUrls: ['./image-previewer.component.scss'],
})
export class ImagePreviewerComponent extends ModalComponent implements AfterViewInit {
  @Input() data: Message[] = [];
  @Input() index: number;

  zoom: ZoomOptions = {
    maxRatio: 5,
    minRatio: 0.75,
    toggle: true
  }

  @ViewChild(SwiperComponent) swiper: SwiperComponent;

  constructor(
    private feedbackService: FeedbackService,
    protected overlayService: OverlayService,
    protected router: Router
  ) {
    super(router, overlayService);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.swiper.setIndex(this.index, 0, true);
      this.swiper.swiperRef.update();
    }, 500);
  }

  onPress(item: Message) {
    this.feedbackService.slightVibrate();
    this.presentActionSheet(item);
  }

  presentActionSheet(item: Message) {
    const buttons: ActionSheetButton[] = [{ text: '取消', role: 'cancel' }];

    if (StrUtil.isString((item.data as ImageMessage).url)) {
      buttons.unshift({ text: '保存图片', handler: () => SysUtil.downLoadFile((item.data as ImageMessage).url) })
    }

    this.overlayService.presentActionSheet(buttons);
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
