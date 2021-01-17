import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ChatRequestStatus, ResultCode, SocketEvent } from 'src/app/common/enum';
import { ChatRequest, Result } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.page.html',
  styleUrls: ['./handle.page.scss'],
})
export class HandlePage implements OnInit {
  chatRequest: ChatRequest;
  chatRequestStatus: typeof ChatRequestStatus = ChatRequestStatus;
  subject: Subject<unknown> = new Subject();

  constructor(
    private socketService: SocketService,
    private overlayService: OverlayService,
    private globalData: GlobalData,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { chatRequest: Result<ChatRequest> | ChatRequest }) => {
      if ((data.chatRequest as ChatRequest).id) {
        this.chatRequest = data.chatRequest as ChatRequest;
      } else if ((data.chatRequest as Result<ChatRequest>).code === ResultCode.Success) {
        this.chatRequest = (data.chatRequest as Result<ChatRequest>).data;
      } else {
        this.overlayService.presentToast('参数错误！');
        this.router.navigateByUrl('/');
      }
    });

    this.socketService.on(SocketEvent.ChatRequestReject).pipe(
      takeUntil(this.subject),
      filter((result: Result<ChatRequest>) => {
        const { code, data } = result;
        // 操作成功,并且处理人是我
        return code === ResultCode.Success && data.handlerId === this.globalData.user.id
      })
    ).subscribe((result: Result<ChatRequest>) => {
      this.chatRequest = result.data;
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  agree() {
    this.overlayService.presentAlert({
      header: '同意申请',
      message: '你确定同意该请求吗？',
      confirmHandler: () => this.socketService.chatRequsetAgree(this.chatRequest.id)
    });
  }

  reject() {
    this.overlayService.presentAlert({
      header: '拒绝申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.chatRequestReject(this.chatRequest.id, data['rejectReason']);
      },
      inputs: [
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
      ]
    });
  }

}
