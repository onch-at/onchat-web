import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/common/constant';
import { ResultCode, SocketEvent } from 'src/app/common/enum';
import { FriendRequest, Result, User } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit, OnDestroy {
  private subject: Subject<unknown> = new Subject();
  /** 用户 */
  user: User;
  /** 好友别名 */
  targetAlias: string = null;
  /** 申请原因 */
  requestReason: string = null;
  /** 对方的拒绝原因 */
  rejectReason: string = null;

  nicknameMaxLength = NICKNAME_MAX_LENGTH;
  reasonMaxLength = REASON_MAX_LENGTH;

  constructor(
    public globalData: GlobalData,
    private socketService: SocketService,
    private overlay: Overlay,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User, friendRequest: Result<FriendRequest> }) => {
      if ((data.user as User).id) {
        this.user = data.user as User;
      } else if ((data.user as Result<User>).code === ResultCode.Success) {
        this.user = (data.user as Result<User>).data;
      }

      const resultFriendRequest = data.friendRequest;
      // 如果之前有申请过，就把之前填过的信息补全上去
      if (resultFriendRequest.code === ResultCode.Success) {
        this.targetAlias = resultFriendRequest.data.targetAlias;
        this.requestReason = resultFriendRequest.data.requestReason;
        this.rejectReason = resultFriendRequest.data.rejectReason;
      }
    });

    this.socketService.on(SocketEvent.FriendRequest).pipe(
      takeUntil(this.subject),
      debounceTime(100)
    ).subscribe((result: Result<FriendRequest | FriendRequest[]>) => {
      const friendRequest = result.data;
      if (Array.isArray(friendRequest) || friendRequest.selfId != this.globalData.user.id || friendRequest.targetId != this.user.id) {
        return;
      }

      result.code === ResultCode.Success && (result.msg = '好友申请已发出，等待对方验证…');

      this.overlay.presentToast(result.msg);

      result.code === ResultCode.Success && setTimeout(() => {
        this.router.navigateByUrl('/');
      }, 250);
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  friendRequest() {
    this.socketService.friendRequest(this.user.id, this.targetAlias, this.requestReason);
  }

}
