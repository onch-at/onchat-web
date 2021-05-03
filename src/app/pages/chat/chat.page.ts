import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Injector, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Scroll } from '@angular/router';
import { IonContent, Platform } from '@ionic/angular';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { NICKNAME_MAX_LENGTH, TEXT_MSG_MAX_LENGTH } from 'src/app/common/constant';
import { Throttle } from 'src/app/common/decorator';
import { ChatroomType, MessageType, ResultCode, SocketEvent } from 'src/app/common/enum';
import { ChatDrawerComponent } from 'src/app/components/chat-drawer/chat-drawer.component';
import { MessageEntity } from 'src/app/entities/message.entity';
import { RevokeMessageTipsMessage, TextMessage } from 'src/app/models/msg.model';
import { Chatroom, ChatSession, Message, Result } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy, AfterViewInit {
  private subject: Subject<unknown> = new Subject();
  /** IonContent滚动元素 */
  private contentElement: HTMLElement;
  /** IonContent滚动元素初始可视高度 */
  private contentClientHeight: number;
  /** 抽屉容器可视高度 */
  private drawerContainerClientHeight: number;

  textMsgMaxLength: number = TEXT_MSG_MAX_LENGTH;

  /** IonContent */
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  /** 抽屉容器 */
  @ViewChild('drawerContainer', { static: true }) drawerContainer: ElementRef<HTMLElement>;
  /** 抽屉 */
  @ViewChild(ChatDrawerComponent, { static: true }) drawer: ChatDrawerComponent;
  /** 文本框 */
  @ViewChild('textarea', { static: true }) textarea: ElementRef<HTMLTextAreaElement>;

  msg: string = '';
  /** 当前房间名字 */
  chatroomName: string = 'Loading…';
  /** 房间ID */
  chatroomId: number;
  /** 聊天室类型 */
  chatroomType: ChatroomType;
  /** 会话列表中对应的会话 */
  chatSession: ChatSession;
  /** 消息ID，用于查询指定消息段 */
  msgId: number = 0;
  /** 聊天记录 */
  msgList: Message[] = [];
  /** 聊天记录是否查到末尾了 */
  end: boolean = false;
  /** 是否有未读消息 */
  hasUnreadMsg: boolean = false;
  /** 是否显示抽屉 */
  showDrawer: boolean = false;
  /** 键盘高度 */
  keyboardHeight: number;

  /** 是否禁用发送按钮 */
  disableSendBtn = () => this.msg.length > TEXT_MSG_MAX_LENGTH;
  /** 是否显示发送按钮 */
  showSendBtn = () => StrUtil.trimAll(this.msg).length > 0;

  constructor(
    public globalData: GlobalData,
    private apiService: ApiService,
    private platform: Platform,
    private socketService: SocketService,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
    private overlay: Overlay,
    private injector: Injector,
  ) { }

  ngOnInit() {
    // 监听路由 滚动事件
    // 场景：从1号房间跳到2号房间，全局房间号变成2，再返回到1号房间，全局房间号变回1
    this.router.events.pipe(
      takeUntil(this.subject),
      filter(event => event instanceof Scroll),
    ).subscribe((event: Scroll) => {
      // 尝试从URL中提取chatroomId
      const chatroomId = +event.routerEvent.url.replace(/\/chat\//, '');
      // 如果提取到的是一个数字，并且服务中的chatroomId跟这个chatroomId不一样，则更新
      if (Number.isInteger(chatroomId) && this.globalData.chatroomId != chatroomId) {
        this.globalData.chatroomId = chatroomId;
      }
    });

    // 记录当前房间ID，用于处理聊天列表
    this.globalData.chatroomId = +this.route.snapshot.params.id;
    this.chatroomId = +this.route.snapshot.params.id;

    this.loadRecords();

    // 先去聊天列表缓存里面查，看看有没有这个房间的数据
    this.chatSession = this.globalData.chatSessions.find(o => o.data.chatroomId === this.chatroomId);

    if (this.chatSession) {
      const { title, data } = this.chatSession;
      this.chatSession.unread = 0;
      this.chatroomName = title;
      this.chatroomType = data.chatroomType;
    } else {
      this.apiService.getChatroom(this.chatroomId).pipe(
        filter((result: Result) => result.code === ResultCode.Success)
      ).subscribe((result: Result<Chatroom>) => {
        const { name, type } = result.data
        this.chatroomName = name;
        this.chatroomType = type;
      });
    }

    this.socketService.on(SocketEvent.Message).pipe(
      takeUntil(this.subject),

      filter((result: Result<Message>) => {
        const { code, data } = result;
        return code === ResultCode.Success && data.chatroomId === this.chatroomId
      }),

      tap((result: Result<Message>) => {
        const { data } = result;

        // 如果不是自己发的消息
        if (data.userId !== this.globalData.user.id) {
          this.msgList.push(data);
          return this.tryToScrollToBottom();
        }

        const has = this.msgList.some(o => (
          o.type === data.type &&
          o.sendTime === data.sendTime
        ));

        if (!has) {
          this.msgList.push(data);
          this.scrollToBottom();
        }
      }),

      debounceTime(3000)
    ).subscribe(() => {
      this.apiService.readedChatSession(this.chatSession.id).subscribe();
    });

    this.socketService.on(SocketEvent.RevokeMessage).pipe(
      takeUntil(this.subject),
      filter((result: Result<{ chatroomId: number, msgId: number }>) => {
        const { code, data } = result;
        return code === ResultCode.Success && data.chatroomId === this.chatroomId
      })
    ).subscribe((result: Result<{ chatroomId: number, msgId: number }>) => {
      const msg = this.msgList.find(o => o.id === result.data.msgId);
      if (msg) {
        const nickname = msg.userId === this.globalData.user.id ? '我' : msg.nickname;
        msg.type = MessageType.Tips;
        msg.data = new RevokeMessageTipsMessage(msg.userId, nickname);
      }
    });

    // 重连时，自动重发
    this.socketService.onInit().pipe(
      takeUntil(this.subject),
      filter(() => this.msgList.some(o => o.loading))
    ).subscribe(() => {
      this.msgList.filter(o => o.loading).forEach(o => {
        (o as MessageEntity).send();
      });
    });
  }

  ngOnDestroy() {
    this.globalData.chatroomId = null;
    this.subject.next();
    this.subject.complete();
  }

  ngAfterViewInit() {
    this.ionContent.getScrollElement().then((element: HTMLElement) => {
      this.contentElement = element;
      this.contentClientHeight = element.clientHeight;
    });

    const drawerContainerElement = this.drawerContainer.nativeElement;

    fromEvent(drawerContainerElement, 'transitionend').pipe(
      takeUntil(this.subject),
      filter((event: TransitionEvent) => {
        const { target, propertyName } = event;
        return target === drawerContainerElement && propertyName === 'height';
      })
    ).subscribe((event: TransitionEvent) => {
      const { clientHeight } = event.target as HTMLElement;

      // 如果抽屉打开了
      if (clientHeight > 0) {
        this.drawerContainerClientHeight = clientHeight;
        this.ionContent.scrollByPoint(0, clientHeight, 30);
      } else {
        const { scrollHeight, scrollTop, clientHeight } = this.contentElement;
        // scrollHeight - scrollTop - clientHeight 得到距离底部的高度
        const canScroll = scrollHeight - scrollTop - clientHeight > this.drawerContainerClientHeight;

        canScroll && this.ionContent.scrollByPoint(0, -this.drawerContainerClientHeight, 30);
      }
    });
  }

  /**
   * 滚动结束时
   */
  onIonScrollEnd() {
    const { scrollHeight, scrollTop, clientHeight } = this.contentElement;
    // 已经有未读消息，且当前位置接近最底部了
    if (this.hasUnreadMsg && scrollHeight - scrollTop - clientHeight <= 50) {
      this.hasUnreadMsg = false;
    }
  }

  onKeyup(event: KeyboardEvent) {
    const { target } = event;
    this.renderer.setStyle(target, 'height', 'auto');
    this.renderer.setStyle(target, 'height', (target as Element).scrollHeight + 2.5 + 'px');
    // const diff = this.contentElement.scrollHeight - this.contentElement.scrollTop - this.contentElement.clientHeight;
    // (diff <= 50 && diff >= 5) && this.scrollToBottom();
    if (
      this.platform.is('desktop') &&
      event.key.toLowerCase() === 'enter' &&
      !event.ctrlKey && !event.shiftKey
    ) {
      this.send();
    }
  }

  @HostListener('window:resize')
  @Throttle(100)
  onWindowResize() {
    this.upliftScroll();
  }

  /**
   * 加载更多消息
   * @param event
   */
  loadMoreRecords(event: any) {
    if (!this.msgId) {
      return this.scrollToBottom().then(() => {
        event.target.complete()
      });
    }
    // 暴力兼容苹果内核
    const isIos = this.platform.is('ios');
    isIos && (this.ionContent.scrollY = false);
    this.loadRecords(() => {
      isIos && (this.ionContent.scrollY = true);
      event.target.complete();
    });
  }

  /**
   * 加载聊天记录
   * @param complete
   */
  loadRecords(complete?: () => void) {
    if (this.end) { return complete?.(); }

    this.apiService.getChatRecords(this.chatroomId, this.msgId).subscribe((result: Result<Message[]>) => {
      if (result.code === ResultCode.Success) {
        // 按照ID排序
        // result.data.sort((a: Message, b: Message) => {
        //   return a.id - b.id;
        // });
        // this.msgList = result.data.concat(this.msgList);

        for (const msgItem of result.data) {
          this.msgList.unshift(msgItem);
        }

        // 如果是第一次查记录，就执行滚动
        !this.msgId && this.scrollToBottom(0);

        this.msgId = this.msgList[0].id;

        // 如果返回的消息里少于10条，则代表这是最后一段消息了
        result.data.length < 15 && (this.end = true);
      } else if (result.code === 1) { // 如果没有消息
        this.end = true;
      } else if (result.code === ResultCode.ErrorNoPermission) { // 如果没有权限
        this.overlay.presentToast('你还没有权限进入此聊天室！');
        this.router.navigateByUrl('/'); // 没权限还想进来，回首页去吧
      }
      complete?.();
    });
  }

  /**
   * 抬升滚动，用于软键盘弹起的时候
   */
  upliftScroll() {
    const diffHeight = this.contentClientHeight - this.contentElement.clientHeight;
    // 如果现在的高度与初始高度的差值是正数，则代表窗口高度变小了
    if (diffHeight > 0) {
      // 只有当抬起高度大于250像素才被认为是键盘高度
      if (diffHeight > 250) {
        this.keyboardHeight = diffHeight;
      }
      this.ionContent.scrollByPoint(0, diffHeight, 250);
    } else if (diffHeight < 0) { // 如果窗口高度变大了，就重新设置一下初始高度
      this.contentClientHeight = this.contentElement.clientHeight;
    }
  }

  /**
   * 滚到底部
   */
  scrollToBottom(duration: number = 500) {
    return this.ionContent.scrollToBottom(duration);
  }

  /**
   * 尝试滚动到底部
   */
  tryToScrollToBottom() {
    const { scrollHeight, scrollTop, clientHeight } = this.contentElement;
    // scrollHeight - scrollTop - clientHeight 得到距离底部的高度
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    if (scrollBottom > 50) {
      this.hasUnreadMsg = true;
    } else {
      this.scrollToBottom();
    }
  }

  /**
   * 发送消息
   */
  send() {
    if (!this.showSendBtn() || this.disableSendBtn()) { return; }

    const { id, avatarThumbnail } = this.globalData.user;

    const msg = new MessageEntity().inject(this.injector);
    msg.chatroomId = this.chatroomId;
    msg.userId = id;
    msg.avatarThumbnail = avatarThumbnail;
    msg.data = new TextMessage(this.msg);

    msg.send();

    msg.data.content = StrUtil.html(this.msg);

    this.msgList.push(msg);
    this.scrollToBottom();

    this.msg = '';

    this.renderer.setStyle(this.textarea.nativeElement, 'height', 'auto');
  }

  /**
   * 显示/隐藏抽屉
   */
  async toggleDrawer() {
    const index = await this.drawer.getIndex();

    if (this.showDrawer && index < 1) {
      this.drawer.setIndex(1);
    } else {
      this.drawer.setIndex(1, 0);
      this.showDrawer = !this.showDrawer;
    }
  }

  /**
   * 打开录音抽屉
   */
  async record() {
    const index = await this.drawer.getIndex();

    if (this.showDrawer && index > 0) {
      this.drawer.setIndex(0);
    } else {
      this.drawer.setIndex(0, 0);
      this.showDrawer = !this.showDrawer;
    }
  }

  /**
   * 隐藏抽屉
   */
  hideDrawer() {
    this.showDrawer &&= false;
  }

  more() {
    if (this.chatroomType === ChatroomType.Group) {
      this.router.navigate(['/chatroom', this.chatroomId]);
    }
  }

  /**
   * 设置好友别名
   */
  setFriendAlias() {
    // 只有私聊才可改好友别名
    if (this.chatroomType !== ChatroomType.Private) { return; }

    this.overlay.presentAlert({
      header: '好友别名',
      confirmHandler: (data: KeyValue<string, any>) => {
        if (data['alias'] === this.chatroomName) { return; }

        this.apiService.setFriendAlias(this.chatroomId, data['alias']).subscribe((result: Result<string>) => {
          const { code, data, msg } = result;
          if (code !== ResultCode.Success) {
            return this.overlay.presentToast(msg);
          }

          this.chatroomName = data;
          this.overlay.presentToast('成功修改好友别名！', 1000);

          const chatSession = this.globalData.chatSessions.find(o => o.data.chatroomId === this.chatroomId);
          if (chatSession) {
            chatSession.title = data;
          }
        });
      },
      inputs: [{
        name: 'alias',
        type: 'text',
        value: this.chatroomName,
        placeholder: '给对方起个好听的别名吧',
        cssClass: 'ipt-primary',
        attributes: {
          maxlength: NICKNAME_MAX_LENGTH
        }
      }]
    });
  }

}
