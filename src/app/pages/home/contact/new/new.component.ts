import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/common/constant';
import { FriendRequestStatus } from 'src/app/common/enum';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  friendRequestStatus: typeof FriendRequestStatus = FriendRequestStatus;

  constructor(
    public globalData: GlobalData,
    private socketService: SocketService,
    private overlay: Overlay,
  ) { }

  ngOnInit() { }

  friendRequestAgree(friendRequestId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.overlay.presentAlert({
      header: '同意申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.friendRequestAgree(friendRequestId, data['requesterAlias']);
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

  friendRequestReject(friendRequestId: number) {
    this.overlay.presentAlert({
      header: '拒绝申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.friendRequestReject(friendRequestId, data['rejectReason']);
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
