import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatMemberRole } from 'src/app/common/enum';
import { ChatMember } from 'src/app/models/onchat.model';
import { Overlay } from 'src/app/services/overlay.service';
import { EntityUtil } from 'src/app/utils/entity.util';
import { SysUtil } from 'src/app/utils/sys.util';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-chat-member-list',
  templateUrl: './chat-member-list.component.html',
  styleUrls: ['./chat-member-list.component.scss'],
})
export class ChatMemberListComponent extends ModalComponent implements OnInit {
  @Input() chatMembers: ChatMember[];
  /** 展示的列表 */
  list: ChatMember[];
  /** 搜索关键字 */
  keyword: string = '';
  /** 虚拟列表项目高度 */
  itemHeight: number = SysUtil.rem2px(3.55);
  getItemHeight: () => number = () => this.itemHeight;
  trackByFn = EntityUtil.trackBy;
  chatMemberRole: typeof ChatMemberRole = ChatMemberRole;

  constructor(
    protected overlay: Overlay,
    protected router: Router
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.list = this.chatMembers;
  }

  onTap(member: ChatMember) {
    this.router.navigate([]).then(() => {
      this.router.navigate(['/user', member.userId]);
    });
  }

  search(keyword: string) {
    if (keyword.length) {
      keyword = keyword.toLowerCase();
      this.list = this.chatMembers.filter(o => (
        o.nickname.toLowerCase().includes(keyword) || (o.userId.toString()).includes(keyword)
      ));
    } else {
      this.list = this.chatMembers;
    }
  }

}
