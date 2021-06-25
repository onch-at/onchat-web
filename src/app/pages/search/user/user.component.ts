import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Throttle } from 'src/app/common/decorator';
import { ResultCode } from 'src/app/common/enum';
import { Result, User } from 'src/app/models/onchat.model';
import { UserService } from 'src/app/services/apis/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  private page: number = 1;
  keyword: string;
  users: User[] = [];

  constructor(
    private userService: UserService
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
  loadData(event: any) {
    if (!this.page) {
      return event.target.complete();
    }

    this.searchUser(++this.page).subscribe(({ data }: Result<User[]>) => {
      data.length ? this.users.concat(data) : this.page = null;

      event.target.complete();
    });
  }

  private searchUser(page: number) {
    return this.userService.search(this.keyword, page).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    );
  }

}
