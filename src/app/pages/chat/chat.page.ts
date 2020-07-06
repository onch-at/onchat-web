import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ChatroomType, MessageType, SocketEvent } from 'src/app/common/enum';
import { StrUtil } from 'src/app/common/util/str';
import { Util } from 'src/app/common/util/util';
import { ChatItem, Message, Result } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { SocketService } from 'src/app/services/socket.service';

// 文本消息最长长度
const MSG_MAX_LENGTH: number = 3000;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  MSG_MAX_LENGTH: number = MSG_MAX_LENGTH;
  msg: string = '';
  /** 当前房间名字 */
  roomName: string = '';
  /** 消息ID，用于查询指定消息段 */
  msgId: number = 0;
  /** 聊天记录 */
  msgList: Message[] = [];
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
  /** 是否有未读消息 */
  hasUnread: boolean = false;
  /** 聊天室类型 */
  chatroomType: ChatroomType = ChatroomType.Group;
  subject: Subject<unknown> = new Subject();

  constructor(
    public onChatService: OnChatService,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private renderer2: Renderer2,
    private element: ElementRef
  ) { }

  ngOnInit() {
    // 记录当前房间ID，用于处理聊天列表
    this.onChatService.chatroomId = this.route.snapshot.params.id;

    this.loadRecords();

    // 先去聊天列表缓存里面查，看看有没有这个房间的数据
    const index = this.onChatService.chatList.findIndex((v: ChatItem) => v.chatroomId == this.onChatService.chatroomId);

    if (index >= 0) {
      this.roomName = this.onChatService.chatList[index].name;
      this.chatroomType = this.onChatService.chatList[index].type;
    } else {
      this.onChatService.getChatroomName(this.onChatService.chatroomId).subscribe((result: Result<string>) => {
        if (result.code === 0) {
          this.roomName = result.data;
        }
      });
    }


    this.socketService.on(SocketEvent.Message).pipe(takeUntil(this.subject)).subscribe((o: Result<Message>) => {
      // 如果请求成功，并且收到的消息是这个房间的
      if (o.code == 0 && o.data.chatroomId == this.onChatService.chatroomId) {
        const canScrollToBottom = this.contentElement.scrollHeight - this.contentElement.scrollTop - this.contentElement.clientHeight <= 50;

        this.msgList.push(o.data);
        // 如果是自己发的消息，或者当前滚动的位置允许滚动
        if (o.data.userId == this.onChatService.userId || canScrollToBottom) {
          this.scrollToBottom();
        } else {
          this.hasUnread = true;
        }
        // 如果消息不是自己的，就设为已读
        o.data.userId != this.onChatService.userId && this.onChatService.readed(this.onChatService.chatroomId).subscribe();
      }
    });

    this.socketService.on(SocketEvent.RevokeMsg).pipe(takeUntil(this.subject)).subscribe((o: Result<{ chatroomId: number, msgId: number }>) => {
      // 如果请求成功，并且收到的消息是这个房间的
      if (o.code == 0 && o.data.chatroomId == this.onChatService.chatroomId) {
        for (const msgItem of this.msgList) {
          if (msgItem.id == o.data.msgId) { // 移除被撤回的那条消息
            msgItem.type = MessageType.Tips;
            msgItem.data.content = `<a target="_blank" href="/card/${msgItem.userId}">${msgItem.nickname}</a> 撤回了一条消息`;
            break;
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.onChatService.chatroomId = null;
    this.subject.next();
    this.subject.complete();
  }

  ngAfterViewInit() {
    this.ionContent.getScrollElement().then((element: HTMLElement) => {
      this.contentElement = element;
      this.contentClientHeight = element.clientHeight;
    });

    // 修改返回按钮的样式，用作未读消息显示
    const ionBackButton = this.element.nativeElement.querySelector('ion-back-button');
    const styleSheet = `
      .button-text {
        background: var(--custom-color-gray);
        padding: .2rem .4rem;
        font-size: .8rem;
        border-radius: 1rem;
      }
    `;
    Util.injectStyleToShadowRoot(this.renderer2, ionBackButton, styleSheet);
  }

  /**
   * 滚动结束时
   */
  onIonScrollEnd() {
    // 已经有未读消息，且当前位置接近最底部了
    if (this.hasUnread && this.contentElement.scrollHeight - this.contentElement.scrollTop - this.contentElement.clientHeight <= 50) {
      this.hasUnread = false;
    }
  }

  onKeyup(e: any) {
    this.renderer2.setStyle(e.target, 'height', 'auto');
    this.renderer2.setStyle(e.target, 'height', e.target.scrollHeight + 'px');
    const diff = this.contentElement.scrollHeight - this.contentElement.scrollTop - this.contentElement.clientHeight;

    (diff <= 50 && diff >= 5) && this.scrollToBottom();
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
    // 暴力兼容苹果内核
    const isAppleWebKit = Util.isAppleWebKit();
    if (isAppleWebKit) { this.ionContent.scrollY = false; }
    this.loadRecords(() => {
      if (isAppleWebKit) { this.ionContent.scrollY = true; }
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

    this.onChatService.getChatRecords(this.onChatService.chatroomId, this.msgId).subscribe((result: Result<Message[]>) => {
      if (result.code === 0) {
        // 按照ID排序
        // result.data.sort((a: Message, b: Message) => {
        //   return a.id - b.id;
        // });
        // this.msgList = result.data.concat(this.msgList);

        for (const msgItem of result.data) {
          this.msgList.unshift(msgItem);
        }

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
  send(textareaElement: HTMLTextAreaElement) {
    if (this.msg.length > MSG_MAX_LENGTH) { return; }
    const msg = new Message(+this.onChatService.chatroomId);
    // TODO 封装成一个文字消息类
    msg.data = this.msg;
    this.socketService.message(msg);
    this.msg = '';
    textareaElement.style.height = 'auto';
  }

  /**
   * 是否禁用发送按钮
   */
  disable() {
    return (StrUtil.trimAll(this.msg) == '' || this.msg.length > MSG_MAX_LENGTH);
  }

}
