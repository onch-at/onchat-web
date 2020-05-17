import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MsgItem } from 'src/app/models/interface.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { PopoverComponent } from '../popover/popover.component';

@Component({
  selector: 'app-msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.scss'],
})
export class MsgListComponent implements OnInit {
  @Input() data: MsgItem[] = [];
  @Input() userId: number;
  @Input() end: boolean;

  constructor(
    private popoverController: PopoverController,
    private feedbackService: FeedbackService
  ) { }

  ngOnInit() {
    
  }

  /**
   * 用于提升性能
   * 一般情况下，当数组内有变更时，
   * Angular将会对整个DOM树加以重新渲染。
   * 如果加上trackBy方法，Angular将会知道具体的变更元素，
   * 并针对性地对此特定元素进行DOM刷新，提升页面渲染性能。
   */
  trackByFn(index: number, item: MsgItem): number {
    return item.id;
  }


  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
      showBackdrop: false
    });
    return popover.present().then(() => {
      this.feedbackService.vibrate();
    });
  }

  /**
   * 判断是否需要显示时间
   * @param time 当前时间
   * @param otherTime 上一个时间
   */
  canShowTime(time: number, otherTime: number): boolean {
    const date = new Date(time);
    const otherDate = new Date(otherTime);

    if ((date.getTime() - otherDate.getTime()) < 300000) {
      return false;
    }

    return true;
  }

}
