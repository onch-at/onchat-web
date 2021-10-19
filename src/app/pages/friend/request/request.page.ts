import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { FriendRequestStatus, ResultCode, SocketEvent } from 'src/app/common/enums';
import { success } from 'src/app/common/operators';
import { WINDOW } from 'src/app/common/tokens';
import { NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/constants';
import { FriendRequest, Result, User } from 'src/app/models/onchat.model';
import { FriendService } from 'src/app/services/apis/friend.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  readonly requestStatus: typeof FriendRequestStatus = FriendRequestStatus;
  readonly nicknameMaxLength = NICKNAME_MAX_LENGTH;
  readonly reasonMaxLength = REASON_MAX_LENGTH;
  /** 用户(对方) */
  user: User;
  /** 好友别名 */
  targetAlias: string;
  /** 申请原因 */
  requestReason: string;
  /** 对方的拒绝原因 */
  rejectReason: string;
  /** 请求状态 */
  status: FriendRequestStatus;

  constructor(
    public globalData: GlobalData,
    private socketService: SocketService,
    private friendService: FriendService,
    private overlay: Overlay,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    @Inject(WINDOW) private window: Window,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ user, request }: { user: User, request: Result<FriendRequest> }) => {
      this.user = user;

      const { data } = request;
      // 如果之前有申请过，就把之前填过的信息补全上去
      this.targetAlias = data.targetAlias;
      this.requestReason = data.requestReason;
      this.rejectReason = data.rejectReason;
      this.status = data.status;

      // 如果未读，则设置为已读
      if (!data.requesterReaded) {
        this.friendService.readedSendRequest(data.id).subscribe();
        const request = this.globalData.sendFriendRequests.find(o => o.id === data.id);
        if (request) {
          request.requesterReaded = true;
        }
      }
    });

    this.socketService.on(SocketEvent.FriendRequest).pipe(
      takeUntil(this.destroy$),
      debounceTime(100),
      tap(({ code, msg }: Result<FriendRequest | FriendRequest[]>) => {
        this.overlay.toast(code === ResultCode.Success ? '好友申请已发出，等待对方验证…' : msg)
      }),
      success(),
      filter(({ data }: Result<FriendRequest | FriendRequest[]>) => (
        !Array.isArray(data) && data.requesterId === this.globalData.user.id && data.targetId === this.user.id
      )),
    ).subscribe(() => {
      this.window.setTimeout(() => {
        this.navCtrl.back();
      }, 250);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  friendRequest() {
    this.socketService.friendRequest(this.user.id, this.targetAlias, this.requestReason);
  }

}
