import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { ChatItem } from 'src/app/models/entity.model';
import { Result } from 'src/app/models/result.model';
import { isSameWeek } from 'src/app/pipes/detail-date.pipe';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OnChatService } from 'src/app/services/onchat.service';
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
    private route: ActivatedRoute
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

  }

  doRefresh(event: any) {
    this.onChatService.getChatList().subscribe((result: Result<ChatItem[]>) => {
      const chatList = sortChatList(result.data);
      this.localStorageService.set(env.chatListKey, chatList);
      this.chatList = chatList;
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
  stickyChatItem(item: ChatItem, i: number) {
    this.onChatService.stickyChatItem(item.id).subscribe((result: Result<any>) => {
      if (result.code == 0) {
        item.sticky = true;
        this.chatList = sortChatList(this.chatList);

        this.ionItemSlidings.forEach((item: IonItemSliding, index: number) => {
          index == i && item.close();
        });
      }
    });
  }

  /**
   * 取消置顶聊天列表子项
   * @param item 
   * @param i 
   */
  unstickyChatItem(item: ChatItem, i: number) {
    this.onChatService.unstickyChatItem(item.id).subscribe((result: Result<any>) => {
      if (result.code == 0) {
        item.sticky = false;
        this.chatList = sortChatList(this.chatList);

        this.ionItemSlidings.forEach((item: IonItemSliding, index: number) => {
          index == i && item.close();
        });
      }
    });
  }

}

/**
 * 按照置顶顺序排序聊天列表
 * @param chatList 
 */
export function sortChatList(chatList: ChatItem[]): ChatItem[] {
  chatList.sort((a: ChatItem, b: ChatItem) => {
    return (b.sticky as any) - (a.sticky as any);
  });
  return chatList;
}
