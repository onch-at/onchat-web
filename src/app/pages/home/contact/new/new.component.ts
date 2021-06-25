import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { NICKNAME_MAX_LENGTH, REASON_MAX_LENGTH } from 'src/app/common/constant';
import { FriendRequestStatus } from 'src/app/common/enum';
import { FriendService } from 'src/app/services/apis/friend.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent {
  readonly friendRequestStatus: typeof FriendRequestStatus = FriendRequestStatus;

  constructor(
    public globalData: GlobalData,
    private friendService: FriendService,
    private socketService: SocketService,
    private overlay: Overlay,
  ) { }

  agree(id: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.overlay.presentAlert({
      header: '同意申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.friendRequestAgree(id, data['requesterAlias']);
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

  reject(id: number) {
    this.overlay.presentAlert({
      header: '拒绝申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.friendRequestReject(id, data['rejectReason']);
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

  // 已读收到的请求
  readedReceiveRequest(id: number, ionItemSliding: IonItemSliding) {
    this.friendService.readedReceiveRequest(id).subscribe();
    const request = this.globalData.receiveFriendRequests.find(o => o.id === id);
    if (request) {
      request.targetReaded = true;
    }
    ionItemSliding.close();
  }

}
