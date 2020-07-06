import { Component, OnInit } from '@angular/core';
import { OnChatService } from 'src/app/services/onchat.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {

  constructor(
    public onChatService: OnChatService,
    private socketService: SocketService,
  ) { }

  ngOnInit() { }

  friendRequestAgree(friendRequestId: number) {
    this.socketService.friendRequestAgree(friendRequestId);
  }

}
