import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Result, User } from 'src/app/models/onchat.model';
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

  constructor(
    public onChatService: OnChatService,
    public overlayService: OverlayService,
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
        this.sessionStorageService.setUser(this.user);
      } else {
        this.overlayService.presentMsgToast('用户不存在！');
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
