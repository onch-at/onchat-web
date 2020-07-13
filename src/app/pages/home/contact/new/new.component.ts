import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FriendRequestStatus } from 'src/app/common/enum';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent implements OnInit {
  friendRequestStatus: typeof FriendRequestStatus = FriendRequestStatus;

  constructor(
    public onChatService: OnChatService,
    private socketService: SocketService,
    private overlayService: OverlayService,
  ) { }

  ngOnInit() { }

  friendRequestAgree(friendRequestId: number, event: any) {
    event.preventDefault();
    event.stopPropagation();

    this.overlayService.presentInputAlert('同意申请', [
      {
        name: 'selfAlias',
        type: 'text',
        placeholder: '顺便给对方起个好听的别名吧',
        cssClass: 'ipt-primary',
        attributes: {
          maxlength: 30
        }
      }
    ], (data: KeyValue<string, any>) => {
      this.socketService.friendRequestAgree(friendRequestId, data['selfAlias'] || undefined);
    });
  }

  friendRequestReject(friendRequestId: number) {
    this.overlayService.presentInputAlert('拒绝申请', [
      {
        name: 'rejectReason',
        type: 'textarea',
        placeholder: '或许可以告诉对方你拒绝的原因',
        cssClass: 'ipt-primary',
        attributes: {
          rows: 4,
          maxlength: 50
        }
      }
    ], (data: KeyValue<string, any>) => {
      this.socketService.friendRequestReject(friendRequestId, data['rejectReason'] || undefined);
    });
  }

}
