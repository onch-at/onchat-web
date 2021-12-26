import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatMemberRole } from 'src/app/common/enums';
import { WINDOW } from 'src/app/common/tokens';
import { ChatMember } from 'src/app/models/onchat.model';
import { Destroyer } from 'src/app/services/destroyer.service';
import { Overlay } from 'src/app/services/overlay.service';
import { CssUtils } from 'src/app/utilities/css.utils';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-chat-member-list',
  templateUrl: './chat-member-list.component.html',
  styleUrls: ['./chat-member-list.component.scss'],
  providers: [Destroyer]
})
export class ChatMemberListComponent extends ModalComponent implements OnInit {
  @Input() chatMembers: ChatMember[];
  /** 展示的列表 */
  list: ChatMember[];
  /** 搜索关键字 */
  keyword: string = '';
  /** 虚拟列表项目高度 */
  itemHeight: number = CssUtils.rem2px(3.55);

  minBufferPx: number = this.window.innerHeight * 1.5;
  maxBufferPx: number = this.window.innerHeight * 2;

  readonly chatMemberRole: typeof ChatMemberRole = ChatMemberRole;

  constructor(
    protected overlay: Overlay,
    protected router: Router,
    protected destroyer: Destroyer,
    @Inject(WINDOW) private window: Window,
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
