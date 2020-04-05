import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { MsgItem } from 'src/app/models/entity.model';
import { Result } from 'src/app/models/result.model';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  /** 当前用户ID */
  userId: number;
  /** 当前房间号 */
  chatroomId: number;
  /** 当前房间名字 */
  roomName: string = '';
  /** 查询聊天记录的页码 */
  page: number = 1;
  /** 聊天记录 */
  msgList: MsgItem[] = [];
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
   * 下拉刷新
   * @param event 
   */
  doRefresh(event) {
    this.loadRecords(() => {
      event.target.complete();
    });
  }

  /**
   * 点击加载更多
   */
  tapToLoadRecords() {
    this.loadRecords(() => {
      this.ionContent.scrollToTop(500);
    });
  }

  /**
   * 加载聊天记录
   * @param complete 
   */
  loadRecords(complete?: CallableFunction) {
    if (this.end) {
      return complete && complete();
    }

    this.onChatService.getChatRecords(this.chatroomId, this.page).subscribe((result: Result<MsgItem[]>) => {
      if (result.code === 0) {
        result.data.sort((a: MsgItem, b: MsgItem) => {
          return a.id - b.id;
        });

        this.page++; // 查询成功则递增页码

        let first = false;
        if (this.msgList.length === 0) { first = true; }
        this.msgList = result.data.concat(this.msgList);
        // 如果是第一次查记录，就执行滚动
        first && this.scrollToBottom();
      } else if (result.code === 1) {
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
  scrollToBottom() {
    this.ionContent.scrollToBottom(500);
  }

}
