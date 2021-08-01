import { Component, Inject } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ResultCode } from 'src/app/common/enum';
import { WINDOW } from 'src/app/common/token';
import { ChatSession, Result } from 'src/app/models/onchat.model';
import { UserService } from 'src/app/services/apis/user.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { CssUtil } from 'src/app/utils/css.util';
import { EntityUtil } from 'src/app/utils/entity.util';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
})
export class FriendComponent implements ViewWillEnter {
  /** 虚拟列表项目高度 */
  itemHeight: number = CssUtil.rem2px(4.425);

  get minBufferPx() { return this.window.innerHeight + this.window.innerHeight / 2 };
  get maxBufferPx() { return this.window.innerHeight * 2; };

  trackByFn = EntityUtil.trackBy;

  constructor(
    private userService: UserService,
    public globalData: GlobalData,
    @Inject(WINDOW) private window: Window,
  ) { }

  ionViewWillEnter() {
    // 如果为空，就加载
    this.globalData.privateChatrooms || this.userService.getPrivateChatrooms().pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(({ data }: Result<ChatSession[]>) => {
      this.globalData.privateChatrooms = data;
    });
  }

}
