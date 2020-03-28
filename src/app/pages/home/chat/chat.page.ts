import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatItem } from 'src/app/models/entity.model';
import { Result } from 'src/app/models/result.model';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chatList: ChatItem[];

  constructor(
    private onChatService: OnChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatListResult: Result<ChatItem[]> }) => {
      this.chatList = data.chatListResult.data;
      console.log(this.chatList)
    });
  }

  /**
   * 移除聊天列表子项
   * @param index 
   */
  removeChatItem(index: number) {
    this.chatList.splice(index, 1);
  }

}
