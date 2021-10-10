import { KeyValue } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/common/constants';
import { FriendRequestStatus, ResultCode, SocketEvent } from 'src/app/common/enums';
import { WINDOW } from 'src/app/common/tokens';
import { FriendRequest, Result, User } from 'src/app/models/onchat.model';
import { FriendService } from 'src/app/services/apis/friend.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.page.html',
  styleUrls: ['./handle.page.scss'],
})
export class HandlePage implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  readonly requestStatus: typeof FriendRequestStatus = FriendRequestStatus;
  /** 用户 */
  user: User;
  request: FriendRequest;

  constructor(
    public globalData: GlobalData,
    private overlay: Overlay,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private friendService: FriendService,
    @Inject(WINDOW) private window: Window,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ user, request }: { user: User, request: Result<FriendRequest> }) => {
      this.user = user;
      this.request = request.data;
    });

    this.socketService.on(SocketEvent.FriendRequestAgree).pipe(takeUntil(this.destroy$)).subscribe(({ code, data }: Result<any>) => {
      if (code === ResultCode.Success && data.requesterId === this.user.id) {
        this.window.setTimeout(() => this.navCtrl.back(), 250);
      }
    });

    this.socketService.on(SocketEvent.FriendRequestReject).pipe(takeUntil(this.destroy$)).subscribe(({ code, data }: Result<FriendRequest>) => {
      if (code === ResultCode.Success && data.requesterId === this.user.id) {
        this.window.setTimeout(() => this.navCtrl.back(), 250);
      }
    });

    // 如果未读，则设置为已读
    const { id, targetReaded } = this.request;
    if (!targetReaded) {
      this.friendService.readedReceiveRequest(id).subscribe();
      const request = this.globalData.receiveFriendRequests.find(o => o.id === id);
      if (request) {
        request.targetReaded = true;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  agree() {
    this.overlay.alert({
      header: '同意申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.friendRequestAgree(this.request.id, data['requesterAlias']);
      },
      inputs: [{
        name: 'requesterAlias',
        type: 'text',
        placeholder: '顺便给对方起个好听的别名吧',
        cssClass: 'ipt-primary',
        attributes: {
          maxlength: NICKNAME_MAX_LENGTH
        }
      }]
    });
  }

  reject() {
    this.overlay.alert({
      header: '拒绝申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.friendRequestReject(this.request.id, data['rejectReason']);
      },
      inputs: [{
        name: 'rejectReason',
        type: 'textarea',
        placeholder: '或许可以告诉对方你拒绝的原因',
        cssClass: 'ipt-primary',
        attributes: {
          rows: 4,
          maxlength: REASON_MAX_LENGTH
        }
      }]
    });
  }

}
