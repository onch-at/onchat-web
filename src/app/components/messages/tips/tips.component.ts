import { Component, Input, OnInit } from '@angular/core';
import { TipsType } from 'src/app/common/enum';
import { TipsMessage } from 'src/app/models/msg.model';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrls: ['./tips.component.scss'],
})
export class TipsComponent implements OnInit {
  @Input() tips: TipsMessage;
  tipsType: typeof TipsType = TipsType;

  constructor() { }

  ngOnInit() { }

}
