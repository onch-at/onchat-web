import { Component, Inject } from '@angular/core';
import { Throttle } from '@ngify/at';
import { SafeAny } from '@ngify/types';
import { WINDOW } from 'src/app/common/tokens';
import { Chatroom, Result } from 'src/app/models/onchat.model';
import { ChatroomService } from 'src/app/services/apis/chatroom.service';
import { CssUtils } from 'src/app/utilities/css.utils';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent {
  private page: number = 1;
  keyword: string;
  chatrooms: Chatroom[] = [];

  /** 虚拟列表项目高度 */
  itemHeight: number = CssUtils.rem2px(4.425);

  minBufferPx: number = this.window.innerHeight * 1.5;
  maxBufferPx: number = this.window.innerHeight * 2;

  constructor(
    private chatroomService: ChatroomService,
    @Inject(WINDOW) private window: Window,
  ) { }

  @Throttle(300)
  search() {
    if (!this.keyword?.length) { return; }

    this.chatrooms = null;

    this.searchChatroom(this.page = 1).subscribe(({ data }: Result<Chatroom[]>) => {
      this.chatrooms = data;
    });
  }

  /**
   * 加载更多
   * @param event
   */
  loadData(event: SafeAny) {
    if (!this.page) {
      return event.target.complete();
    }

    this.searchChatroom(++this.page).subscribe(({ data }: Result<Chatroom[]>) => {
      data.length ? this.chatrooms.concat(data) : this.page = null;

      event.target.complete();
    });
  }

  private searchChatroom(page: number) {
    return this.chatroomService.search(this.keyword, page);
  }
}
