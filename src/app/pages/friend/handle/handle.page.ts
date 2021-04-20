import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/common/constant';
import { ResultCode, SocketEvent } from 'src/app/common/enum';
import { FriendRequest, Result, User } from 'src/app/models/onchat.model';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.page.html',
  styleUrls: ['./handle.page.scss'],
})
export class HandlePage implements OnInit, OnDestroy {
  private subject: Subject<unknown> = new Subject();
  /** 用户 */
  user: User;
  friendRequest: FriendRequest;

  constructor(
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

      if (data.friendRequest.code !== ResultCode.Success) {
        this.overlay.presentToast(data.friendRequest.msg);
        return this.router.navigateByUrl('/');
      }

      this.friendRequest = data.friendRequest.data;
    });

    this.socketService.on(SocketEvent.FriendRequestAgree).pipe(takeUntil(this.subject)).subscribe((result: Result<any>) => {
      if (result.code === ResultCode.Success && result.data.requesterId == this.user.id) {
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 250);
      }
    });

    this.socketService.on(SocketEvent.FriendRequestReject).pipe(takeUntil(this.subject)).subscribe((result: Result<FriendRequest>) => {
      if (result.code === ResultCode.Success && result.data.requesterId == this.user.id) {
        setTimeout(() => {
          this.router.navigateByUrl('/');
        }, 250);
      }
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  agree() {
    this.overlay.presentAlert({
      header: '同意申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.friendRequestAgree(this.friendRequest.id, data['requesterAlias']);
      },
      inputs: [
        {
          name: 'requesterAlias',
          type: 'text',
          placeholder: '顺便给对方起个好听的别名吧',
          cssClass: 'ipt-primary',
          attributes: {
            maxlength: NICKNAME_MAX_LENGTH
          }
        }
      ]
    });
  }

  reject() {
    this.overlay.presentAlert({
      header: '拒绝申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.friendRequestReject(this.friendRequest.id, data['rejectReason']);
      },
      inputs: [
        {
          name: 'rejectReason',
          type: 'textarea',
          placeholder: '或许可以告诉对方你拒绝的原因',
          cssClass: 'ipt-primary',
          attributes: {
            rows: 4,
            maxlength: REASON_MAX_LENGTH
          }
        }
      ]
    });
  }

}
