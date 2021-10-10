import { Component, Inject } from '@angular/core';
import { Throttle } from 'src/app/common/decorators';
import { SafeAny } from 'src/app/common/interfaces';
import { WINDOW } from 'src/app/common/tokens';
import { Result, User } from 'src/app/models/onchat.model';
import { UserService } from 'src/app/services/apis/user.service';
import { CssUtil } from 'src/app/utils/css.util';
import { EntityUtil } from 'src/app/utils/entity.util';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  private page: number = 1;
  keyword: string;
  users: User[] = [];

  /** 虚拟列表项目高度 */
  itemHeight: number = CssUtil.rem2px(4.425);

  minBufferPx: number = this.window.innerHeight * 1.5;
  maxBufferPx: number = this.window.innerHeight * 2;

  trackByFn = EntityUtil.trackBy;

  constructor(
    private userService: UserService,
    @Inject(WINDOW) private window: Window,
  ) { }

  @Throttle(300)
  search() {
    if (!this.keyword?.length) { return; }

    this.users = null;

    this.searchUser(this.page = 1).subscribe(({ data }: Result<User[]>) => {
      this.users = data;
    });
  }

  /**
   * 加载更多
   * @param event
   */
  loadData(event: SafeAny) {
    if (!this.page) {
      return event.target.complete();
    }

    this.searchUser(++this.page).subscribe(({ data }: Result<User[]>) => {
      data.length ? this.users.concat(data) : this.page = null;

      event.target.complete();
    });
  }

  private searchUser(page: number) {
    return this.userService.search(this.keyword, page);
  }

}
