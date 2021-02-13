import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { CHAT_SESSIONS_ROWS } from 'src/app/common/constant';
import { ResultCode } from 'src/app/common/enum';
import { ChatSession, Result } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent implements OnInit, OnDestroy {

  constructor(
    private apiService: ApiService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() {
    // 如果为空，就加载
    !this.globalData.groupChatrooms.length && this.apiService.getGroupChatrooms().pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe((result: Result<ChatSession[]>) => {
      this.globalData.groupChatrooms = result.data;
    });
  }

  ngOnDestroy() {
    this.globalData.groupChatroomsPage = 1;
  }

  chatrooms() {
    const { groupChatroomsPage, groupChatrooms } = this.globalData;
    return groupChatroomsPage ? groupChatrooms.slice(0, groupChatroomsPage * CHAT_SESSIONS_ROWS) : groupChatrooms;
  }

  /**
   * 加载更多
   * @param event
   */
  loadData(event: any) {
    if (!this.globalData.groupChatroomsPage) {
      return event.target.complete();
    }

    if (++this.globalData.groupChatroomsPage * CHAT_SESSIONS_ROWS >= this.globalData.groupChatrooms.length) {
      this.globalData.groupChatroomsPage = null;
    }

    event.target.complete();
  }

}
