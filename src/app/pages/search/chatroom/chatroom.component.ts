import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Throttle } from 'src/app/common/decorator';
import { ResultCode } from 'src/app/common/enum';
import { Chatroom, Result } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent {
  private page: number = 1;
  keyword: string;
  chatrooms: Chatroom[] = [];

  constructor(
    private apiService: ApiService
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
  loadData(event: any) {
    if (!this.page) {
      return event.target.complete();
    }

    this.searchChatroom(++this.page).subscribe(({ data }: Result<Chatroom[]>) => {
      data.length ? this.chatrooms.concat(data) : this.page = null;

      event.target.complete();
    });
  }

  private searchChatroom(page: number) {
    return this.apiService.searchChatroom(this.keyword, page).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    );
  }
}
