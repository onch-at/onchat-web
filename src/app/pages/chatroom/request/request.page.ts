import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { REASON_MAX_LENGTH } from 'src/app/common/constant';
import { ChatRequestStatus, ResultCode, SocketEvent } from 'src/app/common/enum';
import { ChatRequest, Result } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  private subject: Subject<unknown> = new Subject();
  chatRequest: ChatRequest;
  chatRequestStatus: typeof ChatRequestStatus = ChatRequestStatus;
  requestReason: string = null;

  reasonMaxLength = REASON_MAX_LENGTH;

  constructor(
    private socketService: SocketService,
    private overlay: Overlay,
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
        this.overlay.presentToast('参数错误！');
        return this.router.navigateByUrl('/');
      }

      if (this.chatRequest) {
        this.requestReason = this.chatRequest.requestReason;
      }
    });

    this.socketService.on(SocketEvent.ChatRequest).pipe(
      takeUntil(this.subject),
      debounceTime(100)
    ).subscribe((result: Result<ChatRequest>) => {
      const { code, data, msg } = result;

      if (code !== ResultCode.Success) {
        return this.overlay.presentToast('申请失败，原因：' + msg);
      }

      if (data.requesterId === this.globalData.user.id) {
        this.overlay.presentToast('入群申请已发出，等待管理员处理…');

        const index = this.globalData.sendChatRequests.findIndex(o => o.id === data.id);
        if (index >= 0) {
          this.globalData.sendChatRequests[index] = data;
        } else {
          this.globalData.sendChatRequests.unshift(data);
        }

        this.router.navigateByUrl('/');
      }
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  /**
   * 申请加入群聊
   */
  request() {
    this.socketService.chatRequset(this.chatRequest.chatroomId, this.requestReason);
  }

}
