import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Result } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  userId: number;
  /** 私聊房间号 */
  chatroomId: number;

  constructor(
    private socketService: SocketService,
    public onChatService: OnChatService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.userId = this.route.snapshot.params.id;
    this.onChatService.isFriend(this.userId).subscribe((result: Result<number>) => {
      if (result.code == 0) {
        this.chatroomId = result.data;
      }
    });
  }

  friendRequest() {
    this.socketService.friendRequest(this.userId);
  }

}
