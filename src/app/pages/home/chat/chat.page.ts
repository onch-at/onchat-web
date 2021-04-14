import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { slideUpOnLeaveAnimation } from 'src/app/animations/slide.animation';
import { ChatSessionType, MessageType, ResultCode } from 'src/app/common/enum';
import { ChatSession, Result } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { DateUtil } from 'src/app/utils/date.util';
import { EntityUtil } from 'src/app/utils/entity.util';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  animations: [slideUpOnLeaveAnimation]
})
export class ChatPage implements OnInit {
  msgType = MessageType;
  chatSessionType = ChatSessionType;
  /** 虚拟列表项目高度 */
  itemHeight: number = SysUtil.rem2px(4.425);
  getItemHeight: () => number = () => this.itemHeight;
  trackByFn = EntityUtil.trackBy;

  constructor(
    private router: Router,
    private onChatService: OnChatService,
    private apiService: ApiService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() { }

  /**
   * 刷新
   * @param event
   */
  refresh(event: any) {
    this.onChatService.initChatSession().subscribe(() => {
      event.target.complete();
    });
  }

  canShowTime(date: number) {
    return DateUtil.isSameWeek(new Date(date));
  }

  /**
   * 移除聊天列表子项
   * @param index
   */
  removeChatSession(item: ChatSession, ionItemSliding: IonItemSliding) {
    this.globalData.chatSessions = this.globalData.chatSessions.filter(o => o.id !== item.id);
    ionItemSliding.close();
  }

  /**
   * 置顶聊天列表子项
   * @param item
   * @param i
   */
  doStickyChatSession(item: ChatSession, ionItemSliding: IonItemSliding) {
    (item.sticky ? this.apiService.unstickyChatSession(item.id) : this.apiService.stickyChatSession(item.id)).pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe(() => {
      item.sticky = !item.sticky;
      this.globalData.sortChatSessions();
      ionItemSliding.close();
    });
  }

  /**
   * 将聊天列表子项设置为已读
   * @param item
   * @param i
   */
  doReadChatSession(item: ChatSession, ionItemSliding: IonItemSliding) {
    if (item.unread == 0) {
      return this.apiService.unreadChatSession(item.id).pipe(
        filter((result: Result) => result.code === ResultCode.Success)
      ).subscribe(() => {
        item.unread = 1;
        this.globalData.unreadMsgCount++;
        ionItemSliding.close();
      });
    }

    const observable = item.type === ChatSessionType.ChatroomNotice ? this.apiService.readedChatRequests() : this.apiService.readedChatSession(item.id);

    observable.pipe(
      filter((result: Result) => result.code === ResultCode.Success)
    ).subscribe(() => {
      item.unread = 0;
      this.globalData.unreadMsgCount--;
      ionItemSliding.close();
    });
  }

  onTap(chatSession: ChatSession) {
    switch (chatSession.type) {
      case ChatSessionType.Chatroom:
        this.router.navigate(['chat', chatSession.data.chatroomId]);
        break;

      case ChatSessionType.ChatroomNotice:
        this.router.navigateByUrl('/chatroom/notice');
        break;
    }
  }

}
