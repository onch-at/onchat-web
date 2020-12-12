import { Component, OnInit } from '@angular/core';
import { CHAT_ITEM_ROWS } from 'src/app/common/constant';
import { ChatItem, Result } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-buddy',
  templateUrl: './buddy.component.html',
  styleUrls: ['./buddy.component.scss'],
})
export class BuddyComponent implements OnInit {

  constructor(
    private onChatService: OnChatService,
    public globalDataService: GlobalDataService,
  ) { }

  ngOnInit() {
    if (!this.globalDataService.privateChatrooms.length) {
      this.onChatService.getPrivateChatrooms().subscribe((result: Result<ChatItem[]>) => {
        if (result.code !== 0) { return; }

        this.globalDataService.privateChatrooms = result.data;
      });
    }
  }

  privateChatrooms() {
    const { privateChatroomsPage, privateChatrooms } = this.globalDataService;
    return privateChatroomsPage ? privateChatrooms.slice(0, privateChatroomsPage * CHAT_ITEM_ROWS) : privateChatrooms;
  }

  /**
   * 加载更多
   * @param event
   */
  loadData(event: any) {
    if (!this.globalDataService.privateChatroomsPage) {
      return event.target.complete();
    }

    if (++this.globalDataService.privateChatroomsPage * CHAT_ITEM_ROWS >= this.globalDataService.privateChatrooms.length) {
      this.globalDataService.privateChatroomsPage = null;
    }

    event.target.complete();
  }

}
