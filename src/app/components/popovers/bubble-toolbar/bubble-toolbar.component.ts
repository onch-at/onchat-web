import { Component, Inject, Input } from '@angular/core';
import { SafeAny } from '@ngify/types';
import { MessageType } from 'src/app/common/enums';
import { NAVIGATOR } from 'src/app/common/tokens';
import { ImageMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { Socket } from 'src/app/services/socket.service';

@Component({
  selector: 'app-bubble-toolbar',
  templateUrl: './bubble-toolbar.component.html',
  styleUrls: ['./bubble-toolbar.component.scss'],
})
export class BubbleToolbarComponent {
  /** 气泡节点 */
  @Input() element: HTMLElement;
  /** 消息体 */
  @Input() msg: Message;
  /** 当前时间戳 */
  now: number = Date.now();
  /** 消息类型枚举 */
  readonly msgType: typeof MessageType = MessageType;

  constructor(
    public globalData: GlobalData,
    private socket: Socket,
    private overlay: Overlay,
    @Inject(NAVIGATOR) private navigator: Navigator,
  ) { }

  /**
   * 复制文本消息
   */
  async copyText() {
    let data: ClipboardItems;

    if (this.msg.type === MessageType.Image) {
      const response = await fetch((this.msg.data as ImageMessage).url);
      const blob = await response.blob();
      data = [new ClipboardItem({ [blob.type]: blob })];
    } else {
      const blob = new Blob([this.element.innerText], { type: 'text/plain' });
      data = [new ClipboardItem({ [blob.type]: blob })];
    }

    this.navigator.clipboard.write(data).catch(() => {
      this.overlay.toast('复制失败');
    }).finally(() => {
      this.dismiss();
    });
  }

  /**
   * 回复
   */
  reply() {
    this.dismiss(this.msg, 'reply');
  }

  /**
   * 撤回消息
   */
  revokeMessage() {
    this.socket.revokeMessage(this.msg.id, this.globalData.chatroomId);
    this.dismiss();
  }

  /**
   * 关闭气泡消息工具条
   */
  dismiss(data?: SafeAny, role?: string) {
    this.overlay.dismissPopover(data, role);
  }

}
