import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Result, User } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  /** 用户 */
  user: User;
  /** 好友别名 */
  targetAlias: string = '';
  /** 申请原因 */
  requestReason: string = '';

  constructor(
    public onChatService: OnChatService,
    private sessionStorageService: SessionStorageService,
    private socketService: SocketService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User }) => {
      const user = data.user as User;
      if (user.id) { this.user = user; }

      const result = data.user as Result<User>;
      if (result.code == 0) {
        this.user = result.data;
        this.sessionStorageService.addUser(this.user);
      }
    });
  }

  friendRequest() {
    this.socketService.friendRequest(this.user.id, this.targetAlias || null, this.requestReason || null);
  }

}
