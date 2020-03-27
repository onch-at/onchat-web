import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chatroom } from 'src/app/models/entity.model';
import { Result } from 'src/app/models/result.model';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  chatrooms: Chatroom[];

  constructor(
    private onChatService: OnChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatroomResult: Result<Chatroom[]> }) => {
      this.chatrooms = data.chatroomResult.data;
      console.log(this.chatrooms)
    });
  }

}
