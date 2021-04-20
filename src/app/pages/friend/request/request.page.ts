import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/common/constant';
import { ResultCode, SocketEvent } from 'src/app/common/enum';
import { FriendRequest, Result, User } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
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
  targetAlias: string;
  /** 申请原因 */
  requestReason: string;
  /** 对方的拒绝原因 */
  rejectReason: string;

  nicknameMaxLength = NICKNAME_MAX_LENGTH;
  reasonMaxLength = REASON_MAX_LENGTH;

  constructor(
    public globalData: GlobalData,
    private socketService: SocketService,
    private apiService: ApiService,
    private overlay: Overlay,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { user: Result<User> | User, friendRequest: Result<FriendRequest> }) => {
      if ((data.user as User).id) {
        this.user = data.user as User;
      } else if ((data.user as Result<User>).code === ResultCode.Success) {
        this.user = (data.user as Result<User>).data;
      }

      const result = data.friendRequest;
      // 如果之前有申请过，就把之前填过的信息补全上去
      if (result.code === ResultCode.Success) {
        const { data } = result;
        this.targetAlias = data.targetAlias;
        this.requestReason = data.requestReason;
        this.rejectReason = data.rejectReason;

        // 如果未读，则设置为已读
        if (!data.requesterReaded) {
          this.apiService.readedSendFriendRequest(data.id).subscribe();
          const request = this.globalData.sendFriendRequests.find(o => o.id === data.id);
          if (request) {
            request.requesterReaded = true;
          }
        }
      }
    });

    this.socketService.on(SocketEvent.FriendRequest).pipe(
      takeUntil(this.subject),
      debounceTime(100)
    ).subscribe((result: Result<FriendRequest | FriendRequest[]>) => {
      const friendRequest = result.data;
      if (Array.isArray(friendRequest) || friendRequest.requesterId !== this.globalData.user.id || friendRequest.targetId !== this.user.id) {
        return;
      }

      result.code === ResultCode.Success && (result.msg = '好友申请已发出，等待对方验证…');

      this.overlay.presentToast(result.msg);

      result.code === ResultCode.Success && setTimeout(() => {
        this.navCtrl.back();
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
