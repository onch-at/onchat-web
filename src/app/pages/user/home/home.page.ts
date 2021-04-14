import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender, Mood, ResultCode } from 'src/app/common/enum';
import { Result, User } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  /** 用户 */
  user: User;
  /** 私聊房间号 */
  chatroomId: number;

  gender: typeof Gender = Gender;
  mood: typeof Mood = Mood;

  constructor(
    public globalData: GlobalData,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User }) => {
      if ((data.user as User).id) {
        this.user = data.user as User;
      } else if ((data.user as Result<User>).code === ResultCode.Success) {
        this.user = (data.user as Result<User>).data;
      } else {
        this.overlay.presentToast('用户不存在！');
        this.router.navigateByUrl('/');
      }
    });

    this.apiService.isFriend(this.user.id).subscribe((result: Result<number>) => {
      if (result.code === ResultCode.Success) {
        this.chatroomId = result.data;
      }
    });
  }

}
