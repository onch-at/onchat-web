import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-msg-list',
  templateUrl: './msg-list.component.html',
  styleUrls: ['./msg-list.component.scss'],
})
export class MsgListComponent implements OnInit {
  @Input() data = [];
  @Input() userId: number;

  constructor() { }

  ngOnInit() {}

}
