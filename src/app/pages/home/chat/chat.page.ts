import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { CHAT_ITEM_ROWS } from 'src/app/common/constant';
import { ChatroomType, MessageType, ResultCode } from 'src/app/common/enum';
import { ChatItem, Result } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { DateUtil } from 'src/app/utils/date.util';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit {
  /** 消息类型枚举 */
  msgType = MessageType;

  @ViewChildren(IonItemSliding) ionItemSlidings: QueryList<IonItemSliding>;

  constructor(
    private onChatService: OnChatService,
    public globalDataService: GlobalDataService,
  ) { }

  ngOnInit() { }

  /**
   * 用于提升性能
   * 一般情况下，当数组内有变更时，
   * Angular将会对整个DOM树加以重新渲染。
   * 如果加上trackBy方法，Angular将会知道具体的变更元素，
   * 并针对性地对此特定元素进行DOM刷新，提升页面渲染性能。
   */
  trackByFn(index: number, item: ChatItem): number {
    return item.id;
  }

  /**
   * 刷新
   * @param event
   */
  refresh(event: any) {
    this.globalDataService.chatListPage = 1;
    this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
      this.globalDataService.chatList = result.data;
      event.target.complete();
    });
  }

  chatList() {
    const { chatListPage, chatList } = this.globalDataService;
    return chatListPage ? chatList.slice(0, chatListPage * CHAT_ITEM_ROWS) : chatList;
  }

  /**
   * 加载更多
   * @param event
   */
  loadData(event: any) {
    if (!this.globalDataService.chatListPage) {
      return event.target.complete();
    }

    if (++this.globalDataService.chatListPage * CHAT_ITEM_ROWS >= this.globalDataService.chatList.length) {
      this.globalDataService.chatListPage = null;
    }

    event.target.complete();
  }

  /**
   * 是否在同一周
   * @param date
   */
  isSameWeek(date: number) {
    return DateUtil.isSameWeek(new Date(date));
  }

  /**
   * 移除聊天列表子项
   * @param index
   */
  removeChatItem(index: number) {
    // 使用setTimeout解决手指点击后 还未来得及松开 后面的列表项跑上来 触发点击的问题
    setTimeout(() => {
      this.globalDataService.chatList.splice(index, 1);
    }, 50);
  }

  /**
   * 置顶聊天列表子项
   * @param item
   * @param i
   */
  doSticky(item: ChatItem, i: number) {
    if (item.sticky) {
      return this.onChatService.unstickyChatItem(item.id).subscribe((result: Result) => {
        if (result.code === ResultCode.Success) {
          item.sticky = false;
          this.globalDataService.chatList = this.globalDataService.chatList;

          this.closeIonItemSliding(i);
        }
      });
    }

    this.onChatService.stickyChatItem(item.id).subscribe((result: Result) => {
      if (result.code === ResultCode.Success) {
        item.sticky = true;
        this.globalDataService.chatList = this.globalDataService.chatList;

        this.closeIonItemSliding(i);
      }
    });
  }

  /**
   * 将聊天列表子项设置为已读
   * @param item
   * @param i
   */
  doRead(item: ChatItem, i: number) {
    if (item.unread == 0) {
      return this.onChatService.unread(item.chatroomId).subscribe((result: Result) => {
        if (result.code === ResultCode.Success) {
          item.unread = 1;
          this.globalDataService.chatList = this.globalDataService.chatList;

          this.closeIonItemSliding(i);
        }
      });
    }

    this.onChatService.readed(item.chatroomId).subscribe((result: Result) => {
      if (result.code === ResultCode.Success) {
        item.unread = 0;
        this.globalDataService.chatList = this.globalDataService.chatList;

        this.closeIonItemSliding(i);
      }
    });
  }

  /**
   * 合上IonItemSliding
   * @param i
   */
  closeIonItemSliding(i: number) {
    this.ionItemSlidings.forEach((item: IonItemSliding, index: number) => {
      index == i && item.close();
    });
  }

  // TODO 改成管道，但我还没想好名字
  /**
   * 解析会话项的消息的发送者名称
   * @param chatItem
   */
  target(chatItem: ChatItem) {
    if (chatItem.content.userId == this.globalDataService.user.id) {
      return '我: ';
    } else if (chatItem.type == ChatroomType.Private) {
      return 'Ta: '
    } else {
      return chatItem.content.nickname + ': ';
    }
  }

}
