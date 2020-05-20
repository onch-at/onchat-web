import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MessageType } from 'src/app/common/enum';
import { MsgItem } from 'src/app/models/interface.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { BubbleToolbarComponent } from '../bubble-toolbar/bubble-toolbar.component';

@Component({
  selector: 'app-msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.scss'],
})
export class MsgListComponent implements OnInit {
  /** 消息类型枚举 */
  msgType = MessageType;
  /** 消息记录 */
  @Input() data: MsgItem[] = [];
  /** 消息记录是否到了末尾 */
  @Input() end: boolean;

  constructor(
    private popoverController: PopoverController,
    private feedbackService: FeedbackService,
    public onChatService: OnChatService,
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

  /**
   * 弹出BubbleToolbar气泡工具条
   * @param msgItem 气泡对应的MsgItem
   * @param event 
   */
  async presentPopover(msgItem: MsgItem, event: any) {
    this.onChatService.bubbleToolbarPopover = await this.popoverController.create({
      component: BubbleToolbarComponent,
      componentProps: {
        element: event.target,
        msgItem: msgItem,
      },
      cssClass: 'bubble-toolbar-popover',
      event: event,
      showBackdrop: false,
    });

    return this.onChatService.bubbleToolbarPopover.present().then(() => {
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
