import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ChatSessionCheckbox } from 'src/app/common/interface';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { EntityUtil } from 'src/app/utils/entity.util';
import { SysUtil } from 'src/app/utils/sys.util';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-chat-session-selector',
  templateUrl: './chat-session-selector.component.html',
  styleUrls: ['./chat-session-selector.component.scss'],
})
export class ChatSessionSelectorComponent extends ModalComponent {
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
  itemHeight: number = SysUtil.rem2px(3.55);
  getItemHeight: () => number = () => this.itemHeight;
  trackByFn = EntityUtil.trackBy;

  constructor(
    public globalData: GlobalData,
    protected overlay: Overlay,
    protected router: Router
  ) {
    super(router, overlay);
  }

  ngOnInit() {
    super.ngOnInit();
    this.list = this.chatSessions;
  }

  search(keyword: string) {
    if (keyword.length) {
      this.list = this.chatSessions.filter(o => (
        o.title.toLowerCase().includes(keyword) || (o.data.userId + '').includes(keyword)
      ));
    } else {
      this.list = this.chatSessions;
    }
  }

  /**
   * 提交
   */
  async submit() {
    const loading = await this.overlay.presentLoading();
    this.handler(this.getCheckedChatSessions()).subscribe(() => {
      this.overlay.dismissModal();
      loading.dismiss();
    });
  }

  /**
   * 是否可以提交
   */
  canSubmit() {
    return !!this.getCheckedChatSessions().length;
  }

  /**
   * 检测checkbox变更
   */
  onChange(item: ChatSessionCheckbox) {
    if (this.getCheckedChatSessions().length > this.limit) {
      item.checked = false;
    }
  }

  /**
   * 获得已选会话列表
   */
  getCheckedChatSessions() {
    return this.chatSessions.filter(o => o.checked);
  }

  /**
   * 是否禁用checkbox
   */
  disabled() {
    return this.getCheckedChatSessions().length >= this.limit;
  }

}
