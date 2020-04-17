import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { SocketEvent } from 'src/app/common/enum';
import { ChatItem, MsgItem } from 'src/app/models/entity.model';
import { Result } from 'src/app/models/interface.model';
import { isSameWeek } from 'src/app/pipes/detail-date.pipe';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment as env } from '../../../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  /** 当前用户ID */
  userId: number;
  chatList: ChatItem[];
  loading: boolean = true;

  @ViewChildren(IonItemSliding) ionItemSlidings: QueryList<IonItemSliding>;

  constructor(
    private onChatService: OnChatService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
      const chatList = sortChatList(result.data);
      this.localStorageService.set(env.chatListKey, chatList);
      this.chatList = chatList;
      this.loading = false;
    });
    // 先加载缓存
    const data = this.localStorageService.get(env.chatListKey);
    if (data) { this.chatList = data; }

    const userId = this.onChatService.userId;
    if (userId) {
      this.userId = userId;
    } else {
      this.onChatService.getUserId().subscribe((result: Result<number>) => {
        this.onChatService.userId = result.data;
        this.userId = result.data;
      });
    }

    this.socketService.on(SocketEvent.Message).subscribe((o: Result<MsgItem>) => {
      if (o.code == 0) {
        let presence = false; // 收到的消息所属房间是否存在于列表当中
        for (const chatItem of this.chatList) {
          if (chatItem.chatroomId == o.data.chatroomId) { // 如果存在
            if (this.onChatService.chatroomId == o.data.chatroomId) { // 如果用户已经进入消息所属房间
              this.onChatService.readed(chatItem.id).subscribe((result: Result<null>) => {
                if (result.code == 0) {
                  chatItem.unread = 0;
                }
              });
            } else {
              chatItem.unread++;
            }
            chatItem.latestMsg = o.data;
            chatItem.updateTime = +new Date() / 1000;
            this.chatList = sortChatList(this.chatList);
            presence = true;
            break;
          }
        }
        !presence && this.refresh();
      }
    });

  }

  refresh(complete?: CallableFunction) {
    this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
      const chatList = sortChatList(result.data);
      this.localStorageService.set(env.chatListKey, chatList);
      this.chatList = chatList;
      complete && complete();
    });
  }

  doRefresh(event: any) {
    this.refresh(() => {
      event.target.complete();
    });
  }

  /**
   * 是否在同一周
   * @param date 
   */
  isSameWeek(date: string) {
    return isSameWeek(new Date(Date.parse(date)));
  }

  /**
   * 移除聊天列表子项
   * @param index 
   */
  removeChatItem(index: number) {
    // 使用setTimeout解决手指点击后 还未来得及松开 后面的列表项跑上来 触发点击的问题
    setTimeout(() => {
      this.chatList.splice(index, 1);
    }, 10);
  }

  /**
   * 置顶聊天列表子项
   * @param item 
   * @param i 
   */
  doSticky(item: ChatItem, i: number) {
    if (item.sticky) {
      return this.onChatService.unstickyChatItem(item.id).subscribe((result: Result<null>) => {
        if (result.code == 0) {
          item.sticky = false;
          this.chatList = sortChatList(this.chatList);

          this.closeIonItemSliding(i);
        }
      });
    }

    this.onChatService.stickyChatItem(item.id).subscribe((result: Result<null>) => {
      if (result.code == 0) {
        item.sticky = true;
        this.chatList = sortChatList(this.chatList);

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
      return this.onChatService.unread(item.id).subscribe((result: Result<null>) => {
        if (result.code == 0) {
          item.unread = 1;

          this.closeIonItemSliding(i);
        }
      });
    }

    this.onChatService.readed(item.id).subscribe((result: Result<null>) => {
      if (result.code == 0) {
        item.unread = 0;

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

}

/**
 * 按照时间/置顶顺序排序聊天列表
 * @param chatList 
 */
export function sortChatList(chatList: ChatItem[]): ChatItem[] {
  chatList.sort((a: ChatItem, b: ChatItem) => {
    return b.updateTime - a.updateTime;
  });

  chatList.sort((a: ChatItem, b: ChatItem) => {
    return +b.sticky - +a.sticky;
  });

  return chatList;
}
