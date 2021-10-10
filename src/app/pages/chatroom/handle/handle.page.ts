import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { REASON_MAX_LENGTH } from 'src/app/common/constants';
import { ChatRequestStatus, ResultCode, SocketEvent } from 'src/app/common/enums';
import { ChatRequest, Result } from 'src/app/models/onchat.model';
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
  readonly requestStatus: typeof ChatRequestStatus = ChatRequestStatus;
  request: ChatRequest;

  constructor(
    private socketService: SocketService,
    private overlay: Overlay,
    private globalData: GlobalData,
    private route: ActivatedRoute,
    private navCtrl: NavController,
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

    this.socketService.on(SocketEvent.ChatRequestReject).pipe(
      takeUntil(this.destroy$),
      filter(({ code, data }: Result<ChatRequest>) => (
        // 操作成功,并且处理人是我
        code === ResultCode.Success && data.handlerId === this.globalData.user.id
      ))
    ).subscribe(({ data }: Result<ChatRequest>) => {
      this.request = data;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  agree() {
    this.overlay.alert({
      header: '同意申请',
      message: '你确定同意该请求吗？',
      confirmHandler: () => this.socketService.chatRequsetAgree(this.request.id)
    });
  }

  reject() {
    this.overlay.alert({
      header: '拒绝申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.chatRequestReject(this.request.id, data['rejectReason'] || null);
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
