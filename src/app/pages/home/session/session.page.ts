import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { ChatSessionType, MessageType } from 'src/app/common/enums';
import { SafeAny } from 'src/app/common/interfaces';
import { WINDOW } from 'src/app/common/tokens';
import { ChatSession } from 'src/app/models/onchat.model';
import { ChatSessionService } from 'src/app/services/apis/chat-session.service';
import { ChatService } from 'src/app/services/apis/chat.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { CssUtils } from 'src/app/utilities/css.utils';
import { DateUtils } from 'src/app/utilities/date.utils';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage {
  /** 虚拟列表项目高度 */
  itemHeight: number = CssUtils.rem2px(4.425);
  minBufferPx: number = this.window.innerHeight * 1.5;
  maxBufferPx: number = this.window.innerHeight * 2;

  readonly msgType: typeof MessageType = MessageType;
  readonly chatSessionType: typeof ChatSessionType = ChatSessionType;

  constructor(
    private router: Router,
    private onChatService: OnChatService,
    private chatSessionService: ChatSessionService,
    private chatService: ChatService,
    @Inject(WINDOW) private window: Window,
    public globalData: GlobalData,
  ) { }

  /**
   * 刷新
   * @param event
   */
  refresh(event: SafeAny) {
    this.onChatService.initChatSession().pipe(
      finalize(() => event.target.complete())
    ).subscribe();
  }

  canShowTime(date: number) {
    return DateUtils.isSameWeek(new Date(date));
  }

  /**
   * 移除聊天会话
   * @param index
   */
  hideChatSession(item: ChatSession, ionItemSliding: IonItemSliding) {
    this.chatSessionService.hide(item.id).subscribe(() => {
      this.globalData.chatSessions = this.globalData.chatSessions.filter(o => o.id !== item.id);
      ionItemSliding.close();
    });
  }

  /**
   * 置顶聊天会话
   * @param item
   * @param i
   */
  doStickyChatSession(item: ChatSession, ionItemSliding: IonItemSliding) {
    (item.sticky ? this.chatSessionService.unsticky(item.id) : this.chatSessionService.sticky(item.id)).subscribe(() => {
      item.sticky = !item.sticky;
      this.globalData.sortChatSessions();
      ionItemSliding.close();
    });
  }

  /**
   * 将聊天会话设置为已读
   * @param item
   * @param i
   */
  doReadChatSession(item: ChatSession, ionItemSliding: IonItemSliding) {
    if (!item.unread) {
      return this.chatSessionService.unread(item.id).subscribe(() => {
        ionItemSliding.close();
        item.unread = 1;
      });
    }

    (item.type === ChatSessionType.ChatroomNotice ? this.chatService.readedRequests() : this.chatSessionService.readed(item.id)).subscribe(() => {
      ionItemSliding.close();
      item.unread = 0;

      if (item.type === this.chatSessionType.ChatroomNotice) {
        this.globalData.readedChatRequest();
      }
    });
  }

  onTap(chatSession: ChatSession) {
    switch (chatSession.type) {
      case ChatSessionType.Chatroom:
        this.router.navigate(['chat', chatSession.data.chatroomId]);
        break;

      case ChatSessionType.ChatroomNotice:
        this.router.navigateByUrl('/chatroom/news');
        break;
    }
  }

}
