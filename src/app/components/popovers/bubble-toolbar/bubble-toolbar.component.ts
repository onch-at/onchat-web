import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { MessageType } from 'src/app/common/enum';
import { Message } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-bubble-toolbar',
  templateUrl: './bubble-toolbar.component.html',
  styleUrls: ['./bubble-toolbar.component.scss'],
})
export class BubbleToolbarComponent implements OnInit {
  /** 气泡节点 */
  @Input() element: HTMLElement;
  /** 消息体 */
  @Input() msgItem: Message;
  /** 当前时间戳 */
  now: number = Date.now();
  /** 消息类型枚举 */
  msgType: typeof MessageType = MessageType;

  constructor(
    public globalDataService: GlobalDataService,
    private socketService: SocketService,
    private popoverController: PopoverController,
    private clipboard: Clipboard
  ) { }

  ngOnInit() { }

  /**
   * 复制文本消息
   */
  copyText() {
    this.clipboard.copy(this.element.innerText);
    this.dismiss();
  }

  /**
   * 撤回消息
   */
  revokeMsg() {
    this.socketService.revokeMsg(+this.globalDataService.chatroomId, +this.msgItem.id);
    this.dismiss();
  }

  /**
   * 关闭气泡消息工具条
   */
  dismiss() {
    this.popoverController.dismiss();
  }

}
