import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';
import { MessageType } from 'src/app/common/enums';
import { Message } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-bubble-toolbar',
  templateUrl: './bubble-toolbar.component.html',
  styleUrls: ['./bubble-toolbar.component.scss'],
})
export class BubbleToolbarComponent {
  /** 气泡节点 */
  @Input() element: HTMLElement;
  /** 消息体 */
  @Input() msgItem: Message;
  /** 当前时间戳 */
  now: number = Date.now();
  /** 消息类型枚举 */
  readonly msgType: typeof MessageType = MessageType;

  constructor(
    public globalData: GlobalData,
    private socketService: SocketService,
    private overlay: Overlay,
    private clipboard: Clipboard
  ) { }

  /**
   * 复制文本消息
   */
  copyText() {
    this.clipboard.copy(this.element.innerText);
    this.dismiss();
  }

  /**
   * 回复
   */
  reply() {
    this.dismiss(this.msgItem, 'reply');
  }

  /**
   * 撤回消息
   */
  revokeMessage() {
    this.socketService.revokeMessage(this.msgItem.id, this.globalData.chatroomId);
    this.dismiss();
  }

  /**
   * 关闭气泡消息工具条
   */
  dismiss(data?: any, role?: string) {
    this.overlay.dismissPopover(data, role);
  }

}
