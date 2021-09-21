import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Gender, Mood } from 'src/app/common/enum';
import { Result, User } from 'src/app/models/onchat.model';
import { FriendService } from 'src/app/services/apis/friend.service';
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

  readonly gender: typeof Gender = Gender;
  readonly mood: typeof Mood = Mood;

  constructor(
    public globalData: GlobalData,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private friendService: FriendService,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ user }: { user: User }) => {
      if (user) {
        this.user = user;
      } else {
        this.overlay.toast('用户不存在！');
        this.navCtrl.back();
      }
    });

    this.friendService.isFriend(this.user.id).subscribe(({ data }: Result<number>) => {
      this.chatroomId = data;
    });
  }

}
