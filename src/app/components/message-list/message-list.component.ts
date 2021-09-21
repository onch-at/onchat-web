import { Component, EventEmitter, Inject, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { ChatMemberRole, ChatroomType, MessageType } from 'src/app/common/enum';
import { WINDOW } from 'src/app/common/token';
import { ImageMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { VoiceMessageComponent } from '../messages/voice-message/voice-message.component';
import { ImagePreviewerComponent } from '../modals/image-previewer/image-previewer.component';
import { BubbleToolbarComponent } from '../popovers/bubble-toolbar/bubble-toolbar.component';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent {
  /** 消息类型枚举 */
  readonly msgType: typeof MessageType = MessageType;
  /** 聊天室类型枚举 */
  readonly chatroomTypes: typeof ChatroomType = ChatroomType;
  readonly chatMemberRole: typeof ChatMemberRole = ChatMemberRole;
  /** 消息记录 */
  @Input() data: Message[] = [];
  /** 消息记录是否到了末尾 */
  @Input() ended: boolean;
  /** 聊天室类型 */
  @Input() chatroomType: ChatroomType;
  /** 进行回复 */
  @Output() reply: EventEmitter<Message> = new EventEmitter<Message>();

  @ViewChildren(VoiceMessageComponent) voiceMsgList: QueryList<VoiceMessageComponent>;

  trackByFn = (index: number, item: Message) => item.tempId ?? item.id;

  msgItemClass = (userId: number) => {
    const { user } = this.globalData;
    return {
      'msg-item-right': user.id === userId,
      'msg-item-left': user.id !== userId
    };
  };

  constructor(
    private overlay: Overlay,
    private feedbackService: FeedbackService,
    public globalData: GlobalData,
    @Inject(WINDOW) private window: Window
  ) { }

  /**
   * 弹出BubbleToolbar气泡工具条
   * @param msgItem 气泡对应的Message
   * @param element
   * @param event
   */
  async presentBubbleToolbarPopover(msgItem: Message, element: Element, event: Event) {
    event.preventDefault();

    if (!msgItem.id) { return; }

    const popover = await this.overlay.popover({
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

    popover.onWillDismiss().then(({ role, data }) => {
      switch (role) {
        case 'reply':
          this.reply.emit(data);
          break;
      }
    });

    this.feedbackService.slightVibrate();
    // 延迟300ms后才打开点击背景关闭popover
    this.window.setTimeout(() => {
      popover.backdropDismiss = true;
    }, 300);
  }

  /**
   * 判断是否需要显示时间
   * @param time 当前时间
   * @param otherTime 上一个时间
   */
  canShowTime(time: number, otherTime: number): boolean {
    return (time - otherTime) > 90000; // 一分半钟
  }

  previewImage(item: Message<ImageMessage>) {
    const data = this.data.filter(o => o.type === MessageType.Image);
    const index = data.findIndex(o => o === item);

    this.overlay.modal({
      component: ImagePreviewerComponent,
      componentProps: {
        data: data,
        index: index
      }
    });
  }

  playVoice(voiceMsg: VoiceMessageComponent) {
    this.voiceMsgList.forEach(o => o !== voiceMsg && o.pause());
    voiceMsg.play();
  }

}
