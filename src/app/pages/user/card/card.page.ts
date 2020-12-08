import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender, Mood, SessionStorageKey } from 'src/app/common/enum';
import { Result, User } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {
  /** 用户 */
  user: User;
  /** 私聊房间号 */
  chatroomId: number;

  gender: typeof Gender = Gender;
  mood: typeof Mood = Mood;

  constructor(
    private onChatService: OnChatService,
    public globalDataService: GlobalDataService,
    private overlayService: OverlayService,
    private sessionStorageService: SessionStorageService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User }) => {
      if ((data.user as User).id) {
        this.user = data.user as User;
      } else if ((data.user as Result<User>).code == 0) {
        this.user = (data.user as Result<User>).data;
        this.sessionStorageService.setItemToMap(
          SessionStorageKey.UserMap,
          this.user.id,
          this.user
        );
      } else {
        this.overlayService.presentToast('用户不存在！');
        this.router.navigate(['/']);
      }
    });

    this.onChatService.isFriend(this.user.id).subscribe((result: Result<number>) => {
      if (result.code == 0) {
        this.chatroomId = result.data;
      }
    });
  }

}
