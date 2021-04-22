import { Component, Input, OnInit } from '@angular/core';
import { ChatroomType, MessageType } from 'src/app/common/enum';
import { Message } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { EntityUtil } from 'src/app/utils/entity.util';
import { ImagePreviewerComponent } from '../modals/image-previewer/image-previewer.component';
import { BubbleToolbarComponent } from '../popovers/bubble-toolbar/bubble-toolbar.component';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
  /** 消息类型枚举 */
  msgType: typeof MessageType = MessageType;
  /** 聊天室类型枚举 */
  chatroomTypes: typeof ChatroomType = ChatroomType;
  /** 消息记录 */
  @Input() data: Message[] = [];
  /** 消息记录是否到了末尾 */
  @Input() end: boolean;
  /** 聊天室类型 */
  @Input() chatroomType: ChatroomType;

  trackByFn = EntityUtil.trackBy;

  msgItemClass = (userId: number) => {
    const { user } = this.globalData;
    return {
      'msg-item-right': user?.id === userId,
      'msg-item-left': user?.id !== userId
    }
  }

  constructor(
    private overlay: Overlay,
    private feedbackService: FeedbackService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() { }

  /**
   * 弹出BubbleToolbar气泡工具条
   * @param msgItem 气泡对应的Message
   * @param element
   * @param event
   */
  async presentBubbleToolbarPopover(msgItem: Message, element: Element, event: Event) {
    event.preventDefault();

    if (!msgItem.id) { return; }

    const popover = await this.overlay.presentPopover({
      component: BubbleToolbarComponent,
      componentProps: {
        element,
        msgItem
      },
      cssClass: 'bubble-toolbar-popover',
      event,
      showBackdrop: false,
      keyboardClose: false,
      backdropDismiss: false
    });

    this.feedbackService.slightVibrate();
    // 延迟300ms后才打开点击背景关闭popover
    setTimeout(() => {
      popover.backdropDismiss = true;
    }, 300);
  }

  /**
   * 判断是否需要显示时间
   * @param time 当前时间
   * @param otherTime 上一个时间
   */
  canShowTime(time: number, otherTime: number): boolean {
    return (time - otherTime) > 60000; // 一分钟
  }

  previewImage(id: number) {
    const data = this.data.filter(o => o.type === MessageType.Image);
    const index = data.findIndex(o => o.id === id);

    this.overlay.presentModal({
      component: ImagePreviewerComponent,
      componentProps: {
        data: data,
        index: index
      }
    });
  }

}
