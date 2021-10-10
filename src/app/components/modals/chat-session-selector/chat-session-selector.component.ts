import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatSessionCheckbox } from 'src/app/common/interfaces';
import { WINDOW } from 'src/app/common/tokens';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { CssUtil } from 'src/app/utils/css.util';
import { EntityUtil } from 'src/app/utils/entity.util';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-chat-session-selector',
  templateUrl: './chat-session-selector.component.html',
  styleUrls: ['./chat-session-selector.component.scss'],
})
export class ChatSessionSelectorComponent extends ModalComponent implements OnInit {
  /** 标题 */
  @Input() title: string;
  /** 会话列表 */
  @Input() chatSessions: ChatSessionCheckbox[];
  /** 选择数量限制 */
  @Input() limit: number;
  /** 提交处理器 */
  @Input() handler: (data: ChatSessionCheckbox[]) => Observable<unknown>;
  /** 搜索关键字 */
  keyword: string = '';
  /** 加载中 */
  loading: boolean = false;
  /** 展示的列表 */
  list: ChatSessionCheckbox[];
  /** 虚拟列表项目高度 */
  itemHeight: number = CssUtil.rem2px(3.55);

  minBufferPx: number = this.window.innerHeight * 1.5;
  maxBufferPx: number = this.window.innerHeight * 2;
  /** 已选会话列表 */
  get checkedChatSessions() { return this.chatSessions.filter(o => o.checked); }
  get disabled() { return this.checkedChatSessions.length >= this.limit; }

  trackByFn = EntityUtil.trackBy;

  constructor(
    public globalData: GlobalData,
    protected overlay: Overlay,
    protected router: Router,
    @Inject(WINDOW) private window: Window,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.list = this.chatSessions;
  }

  search(keyword: string) {
    if (keyword.length) {
      keyword = keyword.toLowerCase();
      this.list = this.chatSessions.filter(o => (
        o.title.toLowerCase().includes(keyword) || (o.data.userId.toString()).includes(keyword)
      ));
    } else {
      this.list = this.chatSessions;
    }
  }

  /**
   * 提交
   */
  async submit() {
    const loading = await this.overlay.loading();
    this.handler(this.checkedChatSessions).subscribe(() => {
      this.overlay.dismissModal();
      loading.dismiss();
    });
  }

  /**
   * 是否可以提交
   */
  canSubmit() {
    return !!this.checkedChatSessions.length;
  }

  /**
   * 检测checkbox变更
   */
  onChange(item: ChatSessionCheckbox) {
    if (this.checkedChatSessions.length > this.limit) {
      item.checked = false;
    }
  }
}
