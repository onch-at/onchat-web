import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChatRequestStatus, ChatSessionType } from 'src/app/common/enum';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
})
export class NoticePage implements OnInit {
  chatRequestStatus: typeof ChatRequestStatus = ChatRequestStatus;

  constructor(
    private onChatService: OnChatService,
    private socketService: SocketService,
    private overlayService: OverlayService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() {
    this.onChatService.readedChatRequests().subscribe();
    const chatSession = this.globalData.chatSessions.find(o => o.type === ChatSessionType.ChatroomNotice);
    if (chatSession) {
      this.globalData.unreadMsgCount -= chatSession.unread;
      chatSession.unread = 0;
    }
  }

  agreeChatRequest(requestId: number, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.overlayService.presentAlert({
      header: '同意申请',
      message: '你确定同意该请求吗？',
      confirmHandler: () => this.socketService.chatRequsetAgree(requestId)
    });
  }

  rejectChatRequest(requestId: number) {
    this.overlayService.presentAlert({
      header: '拒绝申请',
      confirmHandler: (data: KeyValue<string, any>) => {
        this.socketService.chatRequestReject(requestId, data['rejectReason']);
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
