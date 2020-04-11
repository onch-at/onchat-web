import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Str } from 'src/app/common/util/str';
import { MsgItem } from 'src/app/models/entity.model';
import { Result } from 'src/app/models/result.model';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  msg: string = '';
  /** 当前用户ID */
  userId: number;
  /** 当前房间号 */
  chatroomId: number;
  /** 当前房间名字 */
  roomName: string = '';
  /** 消息ID，用于查询指定消息段 */
  msgId: number = 0;
  /** 聊天记录 */
  msgList: MsgItem[] = [];
  /** 是否是第一次查询 */
  first: boolean = true;
  /** 聊天记录是否查到末尾了 */
  end: boolean = false;
  /** IonContent */
  @ViewChild('ionContent', { static: true }) ionContent: IonContent;
  /** IonContent滚动元素 */
  contentElement: HTMLElement;
  /** IonContent滚动元素初始可视高度 */
  contentClientHeight: number;
  resizeTimeout: any = null;

  constructor(
    private onChatService: OnChatService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data: { userIdResult: Result<number> }) => {
      this.userId = data.userIdResult.data;
    });

    this.chatroomId = this.route.snapshot.params.id;

    this.loadRecords();

    this.onChatService.getChatroomName(this.chatroomId).subscribe((result: Result<string>) => {
      if (result.code === 0) {
        this.roomName = result.data;
      }
    });
  }

  ngAfterViewInit() {
    this.ionContent.getScrollElement().then((element: HTMLElement) => {
      this.contentElement = element;
      this.contentClientHeight = element.clientHeight;
    });
  }

  @HostListener('window:resize')
  onResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
    this.resizeTimeout = setTimeout(() => {
      this.upliftScroll();
    }, 100);
  }

  /**
   * 加载更多消息
   * @param event 
   */
  loadMoreRecords(event) {
    if (this.first) {
      return this.scrollToBottom(() => {
        event.target.complete();
      });
    }
    if (isAppleWebKit()) { this.ionContent.scrollY = false; }
    this.loadRecords(() => {
      if (isAppleWebKit()) { this.ionContent.scrollY = true; }
      event.target.complete();
    });
  }

  /**
   * 点击加载更多
   */
  // tapToLoadRecords() {
  //   this.loadRecords(() => {
  //     this.ionContent.scrollToTop(500);
  //   });
  // }

  /**
   * 加载聊天记录
   * @param complete 
   */
  loadRecords(complete?: CallableFunction) {
    if (this.end) { return complete && complete(); }

    this.onChatService.getChatRecords(this.chatroomId, this.msgId).subscribe((result: Result<MsgItem[]>) => {
      if (result.code === 0) {
        // 按照ID排序
        result.data.sort((a: MsgItem, b: MsgItem) => {
          return a.id - b.id;
        });

        this.msgList = result.data.concat(this.msgList);

        // 如果是第一次查记录，就执行滚动
        this.msgId == 0 && this.scrollToBottom(() => {
          this.first = false;
        });

        this.msgId = this.msgList[0].id;

        if (result.data.length < 15) { // 如果返回的消息里少于10条，则代表这是最后一段消息了
          this.end = true;
        }
      } else if (result.code == 1) { // 如果没有消息
        this.end = true;
      }
      complete && complete();
    });
  }

  /**
   * 抬升滚动，用于软键盘弹起的时候
   */
  upliftScroll() {
    const diffHeight = this.contentClientHeight - this.contentElement.clientHeight;
      // 如果现在的高度与初始高度的差值是正数，则代表窗口高度变小了
      if (diffHeight > 0) {
        this.ionContent.scrollByPoint(0, diffHeight, 500);
      } else if (diffHeight < 0) { // 如果窗口高度变大了，就重新设置一下初始高度
        this.contentClientHeight = this.contentElement.clientHeight;
      }
  }

  /**
   * 滚到底部
   */
  scrollToBottom(complete?: CallableFunction) {
    this.ionContent.scrollToBottom(500).then(() => {
      complete && complete();
    });
  }

  /**
   * 发送消息
   */
  send() {
    this.scrollToBottom();
    console.log(this.msg);
    this.msg = '';
  }

  /**
   * 是否禁用发送按钮
   */
  disable() {
    return Str.trimAll(this.msg) == '';
  }

}

export function isAppleWebKit() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
