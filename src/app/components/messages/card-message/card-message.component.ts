import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-message',
  templateUrl: './card-message.component.html',
  styleUrls: ['./card-message.component.scss'],
})
export class CardMessageComponent implements OnInit {
  @Input() background: string;
  @Input() avatar: string;
  @Input() label: string;
  @Input() title: string;
  @Input() description: string;

  constructor() { }

  ngOnInit() { }

}
