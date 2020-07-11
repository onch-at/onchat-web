import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketEvent } from 'src/app/common/enum';
import { FriendRequest, Result, User } from 'src/app/models/onchat.model';
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
  targetAlias: string = null;
  /** 申请原因 */
  requestReason: string = null;
  subject: Subject<unknown> = new Subject();

  constructor(
    public onChatService: OnChatService,
    private sessionStorageService: SessionStorageService,
    private socketService: SocketService,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User, friendRequest: Result<FriendRequest> }) => {
      if ((data.user as User).id) {
        this.user = data.user as User;
      } else if ((data.user as Result<User>).code == 0) {
        this.user = (data.user as Result<User>).data;
        this.sessionStorageService.setUser(this.user);
      }

      const resultFriendRequest = data.friendRequest;
      // 如果之前有申请过，就把之前填过的信息补全上去
      if (resultFriendRequest.code == 0) {
        this.targetAlias = resultFriendRequest.data.targetAlias || '';
        this.requestReason = resultFriendRequest.data.requestReason || '';
      }
    });

    this.socketService.on(SocketEvent.FriendRequest).pipe(takeUntil(this.subject)).subscribe((o: Result<FriendRequest | FriendRequest[]>) => {
      const friendRequest = o.data;
      if (Array.isArray(friendRequest) || friendRequest.selfId != this.onChatService.userId || friendRequest.targetId != this.user.id) {
        return;
      }

      o.code == 0 && (o.msg = '好友申请已发出，等待对方验证');

      this.presentToast(o.msg);

      o.code == 0 && setTimeout(() => {
        this.router.navigate(['/']);
      }, 250);
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: ' ' + message,
      duration: 2000,
      color: 'dark',
    });
    toast.present();
  }

  friendRequest() {
    this.socketService.friendRequest(this.user.id, this.targetAlias || null, this.requestReason || null);
  }

}
