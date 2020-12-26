import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultCode, SessionStorageKey } from 'src/app/common/enum';
import { Chatroom, Result } from 'src/app/models/onchat.model';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-chatroom-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  chatroom: Chatroom;

  constructor(
    private route: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatroom: Result<Chatroom> | Chatroom }) => {
      if ((data.chatroom as Chatroom).id) {
        this.chatroom = data.chatroom as Chatroom;
      } else if ((data.chatroom as Result<Chatroom>).code === ResultCode.Success) {
        this.chatroom = (data.chatroom as Result<Chatroom>).data;
        this.sessionStorageService.setItemToMap(
          SessionStorageKey.ChatroomMap,
          this.chatroom.id,
          this.chatroom
        );
      }
    });
  }

}
