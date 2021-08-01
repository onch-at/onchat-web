import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { ChatSessionType, MessageType, ResultCode } from 'src/app/common/enum';
import { SafeAny } from 'src/app/common/interface';
import { WINDOW } from 'src/app/common/token';
import { ChatSession, Result } from 'src/app/models/onchat.model';
import { ChatSessionService } from 'src/app/services/apis/chat-session.service';
import { ChatService } from 'src/app/services/apis/chat.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { CssUtil } from 'src/app/utils/css.util';
import { DateUtil } from 'src/app/utils/date.util';
import { EntityUtil } from 'src/app/utils/entity.util';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage {
  /** 虚拟列表项目高度 */
  itemHeight: number = CssUtil.rem2px(4.425);

  get minBufferPx() { return this.window.innerHeight + this.window.innerHeight / 2 };
  get maxBufferPx() { return this.window.innerHeight * 2; };

  readonly msgType: typeof MessageType = MessageType;
  readonly chatSessionType: typeof ChatSessionType = ChatSessionType;

  trackByFn = EntityUtil.trackBy;

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
    this.onChatService.initChatSession().subscribe(() => {
      event.target.complete();
    });
  }

  canShowTime(date: number) {
    return DateUtil.isSameWeek(new Date(date));
  }

  /**
   * 移除聊天会话
   * @param index
   */
  hideChatSession(item: ChatSession, ionItemSliding: IonItemSliding) {
    this.chatSessionService.hide(item.id).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(() => {
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
    (item.sticky ? this.chatSessionService.unsticky(item.id) : this.chatSessionService.sticky(item.id)).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(() => {
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
      return this.chatSessionService.unread(item.id).pipe(
        filter(({ code }: Result) => code === ResultCode.Success)
      ).subscribe(() => {
        ionItemSliding.close();
        item.unread = 1;
      });
    }

    (item.type === ChatSessionType.ChatroomNotice ? this.chatService.readedRequests() : this.chatSessionService.readed(item.id)).pipe(
      filter(({ code }: Result) => code === ResultCode.Success)
    ).subscribe(() => {
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
