import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ResultCode } from 'src/app/common/enum';
import { ChatSession, Result } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { EntityUtil } from 'src/app/utils/entity.util';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent implements OnInit {
  /** 虚拟列表项目高度 */
  itemHeight: number = SysUtil.rem2px(4.425);
  getItemHeight: () => number = () => this.itemHeight;
  trackByFn = EntityUtil.trackBy;

  constructor(
    private apiService: ApiService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() {
    // 如果为空，就加载
    !this.globalData.groupChatrooms.length && this.apiService.getGroupChatrooms().pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe((result: Result<ChatSession[]>) => {
      this.globalData.groupChatrooms = result.data;
    });
  }

}
