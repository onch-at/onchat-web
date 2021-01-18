import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { CHAT_SESSIONS_ROWS } from 'src/app/common/constant';
import { ResultCode } from 'src/app/common/enum';
import { ChatSession, Result } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
})
export class FriendComponent implements OnInit {

  constructor(
    private onChatService: OnChatService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() {
    // 如果为空，就加载
    !this.globalData.privateChatrooms.length && this.onChatService.getPrivateChatrooms().pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe((result: Result<ChatSession[]>) => {
      this.globalData.privateChatrooms = result.data;
    });
  }

  privateChatrooms() {
    const { privateChatroomsPage, privateChatrooms } = this.globalData;
    return privateChatroomsPage ? privateChatrooms.slice(0, privateChatroomsPage * CHAT_SESSIONS_ROWS) : privateChatrooms;
  }

  /**
   * 加载更多
   * @param event
   */
  loadData(event: any) {
    if (!this.globalData.privateChatroomsPage) {
      return event.target.complete();
    }

    if (++this.globalData.privateChatroomsPage * CHAT_SESSIONS_ROWS >= this.globalData.privateChatrooms.length) {
      this.globalData.privateChatroomsPage = null;
    }

    event.target.complete();
  }

}
