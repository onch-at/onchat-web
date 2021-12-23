import { KeyValue } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, NavController, Platform, ViewWillEnter } from '@ionic/angular';
import { debounceTime, filter, finalize, takeUntil, tap } from 'rxjs/operators';
import { ChatroomType, MessageType, ResultCode, SocketEvent } from 'src/app/common/enums';
import { SafeAny } from 'src/app/common/interfaces';
import { success } from 'src/app/common/operators';
import { WINDOW } from 'src/app/common/tokens';
import { NICKNAME_MAX_LENGTH } from 'src/app/constants';
import { MessageEntity } from 'src/app/entities/message.entity';
import { RevokeMessageTipsMessage, TextMessage } from 'src/app/models/msg.model';
import { Chatroom, ChatSession, Message, Result } from 'src/app/models/onchat.model';
import { ChatRecordService } from 'src/app/services/apis/chat-record.service';
import { ChatSessionService } from 'src/app/services/apis/chat-session.service';
import { ChatroomService } from 'src/app/services/apis/chatroom.service';
import { FriendService } from 'src/app/services/apis/friend.service';
import { Destroyer } from 'src/app/services/destroyer.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { Socket } from 'src/app/services/socket.service';
import { StrUtils } from 'src/app/utilities/str.utils';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  providers: [Destroyer]
})
export class ChatPage implements OnInit, OnDestroy, AfterViewInit, ViewWillEnter {
  /** IonContent滚动元素 */
  private contentElement: HTMLElement;

  /** IonContent */
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;

  /** 当前房间名字 */
  chatroomName: string = 'Loading…';
  /** 房间ID */
  chatroomId: number;
  /** 聊天室类型 */
  chatroomType: ChatroomType;
  /** 会话列表中对应的会话 */
  chatSession: ChatSession;
  /** 最先的消息，用于查询指定消息段 */
  firstMsg?: Message;
  /** 聊天记录 */
  msgList: Message[] = [];
  /** 聊天记录是否查到末尾了 */
  ended: boolean = false;
  /** 回复的消息 */
  replyMessage: Message;

  constructor(
    public globalData: GlobalData,
    private chatRecordService: ChatRecordService,
    private chatroomService: ChatroomService,
    private chatSessionService: ChatSessionService,
    private friendService: FriendService,
    private platform: Platform,
    private socket: Socket,
    private route: ActivatedRoute,
    private router: Router,
    private overlay: Overlay,
    private navCtrl: NavController,
    private destroyer: Destroyer,
    @Inject(WINDOW) private window: Window,
  ) { }

  ionViewWillEnter() {
    // 场景：从1号房间跳到2号房间，全局房间号变成2，再返回到1号房间，全局房间号变回1
    const chatroomId = +this.route.snapshot.params.id;
    if (this.globalData.chatroomId !== chatroomId) {
      this.globalData.chatroomId = chatroomId;
    }
  }

  ngOnInit() {
    this.chatroomId = +this.route.snapshot.params.id;
    this.globalData.chatroomId = this.chatroomId;

    this.loadRecords();

    // 先去聊天列表缓存里面查，看看有没有这个房间的数据
    this.chatSession = this.globalData.chatSessions.find(o => o.data.chatroomId === this.chatroomId);

    if (this.chatSession) {
      const { title, data } = this.chatSession;
      this.chatSession.unread = 0;
      this.chatroomName = title;
      this.chatroomType = data.chatroomType;
    } else {
      this.chatroomService.getChatroom(this.chatroomId).subscribe(({ data }: Result<Chatroom>) => {
        const { name, type } = data
        this.chatroomName = name;
        this.chatroomType = type;
      });
    }

    this.socket.on(SocketEvent.Message).pipe(
      takeUntil(this.destroyer),
      success(),
      filter(({ data }: Result<Message>) => data.chatroomId === this.chatroomId),
      tap(({ data }: Result<Message>) => {
        // 如果不是自己发的消息
        if (data.userId !== this.globalData.user.id) {
          this.msgList.push(data);
          return this.tryToScrollToBottom();
        }

        const has = this.msgList.some(o => (
          o.type === data.type &&
          o.tempId === data.tempId
        ));

        if (!has) {
          this.msgList.push(data);
          this.scrollToBottom();
        }
      }),
      debounceTime(3000)
    ).subscribe(() => {
      this.chatSession && this.chatSessionService.readed(this.chatSession.id).subscribe();
    });

    this.socket.on(SocketEvent.RevokeMessage).pipe(
      takeUntil(this.destroyer),
      success(),
      filter(({ data }: Result<{ chatroomId: number, msgId: number }>) => data.chatroomId === this.chatroomId)
    ).subscribe(({ data }: Result<{ chatroomId: number, msgId: number }>) => {
      const msg = this.msgList.find(o => o.id === data.msgId);
      if (msg) {
        msg.nickname = msg.userId === this.globalData.user.id ? '我' : msg.nickname;
        msg.type = MessageType.Tips;
        msg.data = new RevokeMessageTipsMessage();
      }
    });

    // 重连时，自动重发
    this.socket.initialized.pipe(
      takeUntil(this.destroyer),
      success(),
      filter(() => this.msgList.some(o => o.loading)),
    ).subscribe(() => {
      this.msgList.filter(o => o.loading).forEach(o => {
        (o as MessageEntity).send();
      });
    });
  }

  ngOnDestroy() {
    this.globalData.chatroomId = null;
  }

  ngAfterViewInit() {
    this.ionContent.getScrollElement().then((element: HTMLElement) => {
      this.contentElement = element;
    });
  }

  onMessagePush(msg: MessageEntity) {
    this.msgList.push(msg);
    msg.send();

    if (msg.data instanceof TextMessage) {
      msg.data.content = StrUtils.html(msg.data.content);
    }

    this.scrollToBottom(300);
  }

  /**
   * 加载更多消息
   * @param event
   */
  async loadMoreRecords({ target }: SafeAny) {
    if (!this.firstMsg) {
      await this.scrollToBottom();
      return target.complete();
    }

    // 暴力兼容苹果内核
    const isIos = this.platform.is('ios');
    isIos && (this.ionContent.scrollY = false);
    this.loadRecords(() => {
      isIos && (this.ionContent.scrollY = true);
      target.complete();
    });
  }

  /**
   * 加载聊天记录
   * @param complete
   */
  loadRecords(complete?: () => void) {
    if (this.ended) { return complete?.(); }

    this.chatRecordService.getChatRecords(this.firstMsg?.id || 0, this.chatroomId).pipe(
      finalize(() => complete?.())
    ).subscribe({
      next: ({ data }: Result<Message[]>) => {
        for (const msg of data) {
          this.msgList.unshift(msg);
        }

        // 如果返回的消息里少于15条，则代表这是最后一段消息了
        if (data.length < 15) {
          this.ended = true;
        }

        // 如果是第一次查记录，就执行滚动
        this.firstMsg || this.window.setTimeout(() => {
          this.scrollToBottom(0);
        }, 10);

        if (data.length) {
          this.firstMsg = this.msgList[0];
        }
      },
      error: ({ error }: { error: Result }) => {
        error.code === ResultCode.NoPermission && this.navCtrl.back();
      }
    });
  }

  /**
   * 滚到底部
   */
  scrollToBottom(duration: number = 500) {
    return new Promise<void>(resolve => this.window.setTimeout(async () => {
      await this.ionContent.scrollToBottom(duration);
      resolve();
    }));
  }

  /**
   * 尝试滚动到底部
   */
  private tryToScrollToBottom() {
    const { scrollHeight, scrollTop, clientHeight } = this.contentElement;
    // scrollHeight - scrollTop - clientHeight 得到距离底部的高度
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    scrollBottom <= 100 && this.scrollToBottom();
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

    this.overlay.alert({
      header: '好友别名',
      confirmHandler: (data: KeyValue<string, any>) => {
        if (data['alias'] === this.chatroomName) { return; }

        this.friendService.setAlias(this.chatroomId, data['alias']).subscribe(({ code, data, msg }: Result<string>) => {
          this.chatroomName = data;
          this.overlay.toast('成功修改好友别名！', 1000);

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
