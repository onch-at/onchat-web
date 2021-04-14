import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { slideUpOnLeaveAnimation } from 'src/app/animations/slide.animation';
import { ChatroomType, ChatSessionType, MessageType, ResultCode } from 'src/app/common/enum';
import { ChatSession, IEntity, Result } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { DateUtil } from 'src/app/utils/date.util';
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
  itemHeight: number;

  constructor(
    private router: Router,
    private onChatService: OnChatService,
    private apiService: ApiService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() {
    this.itemHeight = SysUtil.rem2px(4.425);
  }

  /**
   * 用于提升性能
   * 一般情况下，当数组内有变更时，
   * Angular将会对整个DOM树加以重新渲染。
   * 如果加上trackBy方法，Angular将会知道具体的变更元素，
   * 并针对性地对此特定元素进行DOM刷新，提升页面渲染性能。
   */
  trackByFn(index: number, item: IEntity): number {
    return item.id;
  }

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
    this.onChatService[item.sticky ? 'unstickyChatSession' : 'stickyChatSession'](item.id).pipe(
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

  // TODO 改成管道，但我还没想好名字
  /**
   * 解析消息会话项的的发送者名称
   * @param chatSession
   */
  target(chatSession: ChatSession) {
    if (chatSession.content.userId === this.globalData.user.id) {
      return '我: ';
    }
    if (chatSession.data.chatroomType === ChatroomType.Private) {
      return 'Ta: '
    }
    return (chatSession.content.nickname || chatSession.content.userId) + ': ';
  }

}
