import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Injector, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { IonContent, Platform } from '@ionic/angular';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TEXT_MSG_MAX_LENGTH } from 'src/app/common/constants';
import { Throttle } from 'src/app/common/decorators';
import { ChatroomType, ResultCode, SocketEvent } from 'src/app/common/enums';
import { MessageEntity } from 'src/app/entities/message.entity';
import { TextMessage } from 'src/app/models/msg.model';
import { Message, Result } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { ImageService } from 'src/app/services/image.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { ChatDrawerComponent } from '../chat-drawer/chat-drawer.component';

@Component({
  selector: 'app-chat-bottom-bar',
  templateUrl: './chat-bottom-bar.component.html',
  styleUrls: ['./chat-bottom-bar.component.scss'],
})
export class ChatBottomBarComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$: Subject<void> = new Subject<void>();
  /** IonContent滚动元素 */
  private contentElement: HTMLElement;
  /** IonContent滚动元素初始可视高度 */
  private contentClientHeight: number;
  /** 抽屉容器可视高度 */
  private drawerClientHeight: number;
  private _replyMessage: Message;

  readonly textMsgMaxLength: number = TEXT_MSG_MAX_LENGTH;

  /** 页面内容 */
  @Input() ionContent: IonContent;
  /** 回复的消息 */
  @Input() set replyMessage(value: Message) {
    this._replyMessage = value;
    value && this.textarea.nativeElement.focus();
  };
  get replyMessage(): Message { return this._replyMessage };
  /** 聊天室类型 */
  @Input() chatroomType: ChatroomType;

  @Output() msgpush: EventEmitter<MessageEntity> = new EventEmitter<MessageEntity>();
  /** 进行回复 */
  @Output() reply: EventEmitter<Message> = new EventEmitter<Message>();

  /** 抽屉 */
  @ViewChild(ChatDrawerComponent, { static: true }) drawer: ChatDrawerComponent;
  /** 抽屉容器 */
  @ViewChild('drawerContainer', { static: true }) drawerContainer: ElementRef<HTMLElement>;
  /** 文本框 */
  @ViewChild('textarea', { static: true }) textarea: ElementRef<HTMLTextAreaElement>;

  textareaId: string = 'message-' + StrUtil.random();
  /** 文字消息 */
  msg: string = '';
  /** 是否显示抽屉 */
  showDrawer: boolean = false;
  /** 键盘高度 */
  keyboardHeight: number;
  /** 是否有未读消息 */
  hasUnreadMsg: boolean;

  /** 是否禁用发送按钮 */
  disableSendBtn = () => this.msg.length > TEXT_MSG_MAX_LENGTH;
  /** 是否显示发送按钮 */
  canSend = () => StrUtil.trimAll(this.msg).length > 0;

  constructor(
    public globalData: GlobalData,
    public elementRef: ElementRef<HTMLElement>,
    private socketService: SocketService,
    private overlay: Overlay,
    private imageService: ImageService,
    private renderer: Renderer2,
    private platform: Platform,
    private injector: Injector,
  ) { }

  ngOnInit() {
    const { chatroomId, user } = this.globalData;
    this.socketService.on(SocketEvent.Message).pipe(
      takeUntil(this.destroy$),
      filter(({ code, data }: Result<Message>) => (
        // 如果是这个房间的，且不是我的消息
        code === ResultCode.Success && data.chatroomId === chatroomId && data.userId !== user.id
      )),
      filter(() => {
        const { scrollHeight, scrollTop, clientHeight } = this.contentElement;
        // scrollHeight - scrollTop - clientHeight 得到距离底部的高度
        const scrollBottom = scrollHeight - scrollTop - clientHeight;
        return scrollBottom > 100;
      })
    ).subscribe(() => {
      this.hasUnreadMsg = true;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.ionContent.getScrollElement().then((element: HTMLElement) => {
      this.contentElement = element;
      this.contentClientHeight = element.clientHeight;
    });

    const drawerContainerElement = this.drawerContainer.nativeElement;

    fromEvent(drawerContainerElement, 'transitionend').pipe(
      takeUntil(this.destroy$),
      filter(({ target, propertyName }: TransitionEvent) => (
        target === drawerContainerElement && propertyName === 'height'
      ))
    ).subscribe(({ target }: TransitionEvent) => {
      const { clientHeight } = target as HTMLElement;

      // 如果抽屉打开了
      if (clientHeight > 0) {
        this.drawerClientHeight = clientHeight;
        this.ionContent.scrollByPoint(0, clientHeight, 50);
      } else {
        const { scrollHeight, scrollTop, clientHeight } = this.contentElement;
        // scrollHeight - scrollTop - clientHeight 得到距离底部的高度
        const canScroll = scrollHeight - scrollTop - clientHeight > this.drawerClientHeight;

        canScroll && this.ionContent.scrollByPoint(0, -this.drawerClientHeight, 50);
      }
    });
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
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

  onMessagePush(msg: MessageEntity) {
    this.msgpush.emit(msg);
  }

  onKeyup({ target, key, ctrlKey, shiftKey }: KeyboardEvent) {
    this.renderer.setStyle(target, 'height', 'auto');
    this.renderer.setStyle(target, 'height', (target as Element).scrollHeight + 2.5 + 'px');
    // const diff = this.contentElement.scrollHeight - this.contentElement.scrollTop - this.contentElement.clientHeight;
    // (diff <= 50 && diff >= 5) && this.scrollToBottom();
    if (this.platform.is('desktop') && key.toLowerCase() === 'enter' && !ctrlKey && !shiftKey) {
      this.send();
    }
  }

  onKeypress(event: KeyboardEvent) {
    if (
      this.platform.is('desktop') &&
      event.key.toLowerCase() === 'enter' &&
      !event.ctrlKey && !event.shiftKey
    ) {
      event.preventDefault(); // 回车发送的时候阻止默认行为，不插入换行
    }
  }

  onPaste({ clipboardData: { items } }: ClipboardEvent) {
    const length = items.length;
    const item = items[length - 1];

    if (!length || item?.kind !== 'file') { return; }

    const file = item.getAsFile();

    this.imageService.isImage(file) && this.overlay.alert({
      header: '发送图片',
      message: '你确定要发送粘贴板中的图片吗？',
      cancelText: '原图发送',
      confirmText: '发送',
      cancelHandler: () => this.drawer.createImageMessage(file, true),
      confirmHandler: () => this.drawer.createImageMessage(file, false)
    });
  }

  /**
   * 抬升滚动，用于软键盘弹起的时候
   */
  @HostListener('window:resize')
  @Throttle(100)
  onWindowResize() {
    const { clientHeight } = this.contentElement;
    const diffHeight = this.contentClientHeight - clientHeight;
    // 如果现在的高度与初始高度的差值是正数，则代表窗口高度变小了
    if (diffHeight > 0) {
      // 只有当抬起高度大于250像素才被认为是键盘高度
      if (diffHeight > 250) {
        this.keyboardHeight = diffHeight;
      }
      this.ionContent.scrollByPoint(0, diffHeight, 250);
    } else if (diffHeight < 0) { // 如果窗口高度变大了，就重新设置一下初始高度
      this.contentClientHeight = clientHeight;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick({ target }: MouseEvent) {
    const element = target as Element;
    if (element.clientHeight && !this.elementRef.nativeElement.contains(element)) {
      this.hideDrawer();
    }
  }

  /**
   * 发送消息
   */
  send() {
    if (!this.canSend() || this.disableSendBtn()) { return; }

    const { chatroomId, user: { id, avatarThumbnail } } = this.globalData;
    const msg = new MessageEntity().inject(this.injector);
    msg.chatroomId = chatroomId;
    msg.userId = id;
    msg.avatarThumbnail = avatarThumbnail;
    msg.data = new TextMessage(this.msg);

    if (this.replyMessage) {
      msg.replyId = this.replyMessage.id;
      this.reply.emit(null);
    }

    this.msgpush.emit(msg);

    this.msg = '';

    this.renderer.setStyle(this.textarea.nativeElement, 'height', 'auto');
  }

  /**
   * 打开录音抽屉
   */
  record() {
    if (this.showDrawer && this.drawer.activeIndex > 0) {
      this.drawer.slideTo(0);
    } else {
      this.drawer.slideTo(0, 0);
      this.showDrawer = !this.showDrawer;
    }
  }

  /**
   * 隐藏抽屉
   */
  hideDrawer() {
    this.showDrawer &&= false;
  }

  /**
   * 显示/隐藏抽屉
   */
  toggleDrawer() {
    if (this.showDrawer && this.drawer.activeIndex < 1) {
      this.drawer.slideTo(1);
    } else {
      this.drawer.slideTo(1, 0);
      this.showDrawer = !this.showDrawer;
    }
  }

  viewUnreadMessage() {
    this.ionContent.scrollToBottom(300);
    this.hasUnreadMsg = false;
  }

  cancelReply() {
    this.reply.emit(null);
  }
}
