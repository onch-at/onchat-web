import { Component, Input } from '@angular/core';
import { TipsType } from 'src/app/common/enums';
import { TipsMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-tips-message',
  templateUrl: './tips-message.component.html',
  styleUrls: ['./tips-message.component.scss'],
})
export class TipsMessageComponent {
  @Input() msg: Message<TipsMessage>;
  readonly tipsType: typeof TipsType = TipsType;

  constructor(
    public globalData: GlobalData
  ) { }

}
