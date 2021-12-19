import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter, takeUntil } from 'rxjs/operators';
import { ChatRequestStatus, SocketEvent } from 'src/app/common/enums';
import { success } from 'src/app/common/operators';
import { REASON_MAX_LENGTH } from 'src/app/constants';
import { ChatRequest, Result } from 'src/app/models/onchat.model';
import { Destroyer } from 'src/app/services/destroyer.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { Socket } from 'src/app/services/socket.service';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.page.html',
  styleUrls: ['./handle.page.scss'],
  providers: [Destroyer]
})
export class HandlePage implements OnInit {
  readonly requestStatus: typeof ChatRequestStatus = ChatRequestStatus;
  request: ChatRequest;

  constructor(
    private socket: Socket,
    private route: ActivatedRoute,
    private overlay: Overlay,
    private globalData: GlobalData,
    private navCtrl: NavController,
    private destroyer: Destroyer,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ request }: { request: ChatRequest }) => {
      if (request) {
        this.request = request;
      } else {
        this.overlay.toast('参数错误！');
        this.navCtrl.back();
      }
    });

    this.socket.on(SocketEvent.ChatRequestReject).pipe(
      takeUntil(this.destroyer),
      success(),
      // 操作成功,并且处理人是我
      filter(({ data }: Result<ChatRequest>) => data.handlerId === this.globalData.user.id)
    ).subscribe(({ data }: Result<ChatRequest>) => {
      this.request = data;
    });
  }

  agree() {
    this.overlay.alert({
      header: '同意申请',
      message: '你确定同意该请求吗？',
      confirmHandler: () => this.socket.chatRequsetAgree(this.request.id)
    });
  }

  reject() {
    this.overlay.alert({
      header: '拒绝申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socket.chatRequestReject(this.request.id, data['rejectReason'] || null);
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
