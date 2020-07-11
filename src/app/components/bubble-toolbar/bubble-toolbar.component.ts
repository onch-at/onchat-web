import { Component, Input, OnInit } from '@angular/core';
import { MessageType } from 'src/app/common/enum';
import { SysUtil } from 'src/app/common/utils/sys.util';
import { Message } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-bubble-toolbar',
  templateUrl: './bubble-toolbar.component.html',
  styleUrls: ['./bubble-toolbar.component.scss'],
})
export class BubbleToolbarComponent implements OnInit {
  /** 气泡节点 */
  @Input() element: Element;
  /** 消息体 */
  @Input() msgItem: Message;
  /** 当前时间戳 */
  now: number = Date.now();
  /** 消息类型枚举 */
  msgType: typeof MessageType = MessageType;

  constructor(
    public onChatService: OnChatService,
    private socketService: SocketService,
  ) { }

  ngOnInit() { }

  /**
   * 复制文本消息
   */
  copyText() {
    SysUtil.copyText(this.element);
    this.dismiss();
  }

  /**
   * 撤回消息
   */
  revokeMsg() {
    this.socketService.revokeMsg(this.onChatService.chatroomId, this.msgItem.id);
    this.dismiss();
  }

  /**
   * 关闭气泡消息工具条
   */
  dismiss() {
    this.onChatService.bubbleToolbarPopover && this.onChatService.bubbleToolbarPopover.dismiss().then(() => {
      this.onChatService.bubbleToolbarPopover = null;
    });
  }

}
