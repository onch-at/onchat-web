import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chatroom, Result } from 'src/app/models/onchat.model';

@Component({
  selector: 'app-chatroom-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  chatroom: Chatroom;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatroom: Result<Chatroom> }) => {
      this.chatroom = data.chatroom.data;
    });
  }

}
