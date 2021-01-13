import { Component, OnInit } from '@angular/core';
import { ChatSessionType } from 'src/app/common/enum';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
})
export class NoticePage implements OnInit {

  constructor(
    private onChatService: OnChatService,
    public globalDataService: GlobalDataService,
  ) { }

  ngOnInit() {
    this.onChatService.readedChatRequests().subscribe();
    const chatSession = this.globalDataService.chatSessions.find(o => o.type === ChatSessionType.ChatroomNotice);
    if (chatSession) {
      this.globalDataService.unreadMsgCount -= chatSession.unread;
      chatSession.unread = 0;
    }
  }

}
