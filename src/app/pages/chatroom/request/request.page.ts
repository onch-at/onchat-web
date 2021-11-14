import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ChatRequestStatus, ResultCode, SocketEvent } from 'src/app/common/enums';
import { REASON_MAX_LENGTH } from 'src/app/constants';
import { ChatRequest, Result } from 'src/app/models/onchat.model';
import { Destroyer } from 'src/app/services/destroyer.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
  providers: [Destroyer]
})
export class RequestPage implements OnInit {
  readonly requestStatus: typeof ChatRequestStatus = ChatRequestStatus;
  readonly reasonMaxLength = REASON_MAX_LENGTH;
  request: ChatRequest;
  requestReason: string = null;

  constructor(
    private socketService: SocketService,
    private overlay: Overlay,
    private globalData: GlobalData,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private destroyer: Destroyer,
  ) { }

  ngOnInit() {
    this.route.data.subscribe(({ request }: { request: ChatRequest }) => {
      if (request) {
        this.request = request;
        this.requestReason = this.request.requestReason;
      } else {
        this.overlay.toast('参数错误！');
        this.navCtrl.back();
      }
    });

    this.socketService.on(SocketEvent.ChatRequest).pipe(
      takeUntil(this.destroyer),
      debounceTime(100)
    ).subscribe(({ code, data, msg }: Result<ChatRequest>) => {
      if (code !== ResultCode.Success) {
        return this.overlay.toast('申请失败，原因：' + msg);
      }

      if (data.requesterId === this.globalData.user.id) {
        this.overlay.toast('入群申请已发出，等待管理员处理…');

        const index = this.globalData.sendChatRequests.findIndex(o => o.id === data.id);
        if (index >= 0) {
          this.globalData.sendChatRequests[index] = data;
        } else {
          this.globalData.sendChatRequests.unshift(data);
        }
        this.navCtrl.navigateBack('/');
      }
    });
  }

  /**
   * 申请加入群聊
   */
  chatRequest() {
    this.socketService.chatRequset(this.request.chatroomId, this.requestReason);
  }

}
