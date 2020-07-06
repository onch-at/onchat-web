import { Component, OnInit } from '@angular/core';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  constructor(
    public onChatService: OnChatService,
  ) { }

  ngOnInit() {
  }

}
