import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmailBinderComponent } from '../components/modals/email-binder/email-binder.component';
import { ChatRequest, ChatSession, FriendRequest, Result } from '../models/onchat.model';
import { AuthService } from './apis/auth.service';
import { ChatSessionService } from './apis/chat-session.service';
import { ChatService } from './apis/chat.service';
import { FriendService } from './apis/friend.service';
import { GlobalData } from './global-data.service';
import { Overlay } from './overlay.service';
import { SocketService } from './socket.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class OnChatService {

  constructor(
    private router: Router,
    private overlay: Overlay,
    private globalData: GlobalData,
    private authService: AuthService,
    private chatService: ChatService,
    private tokenService: TokenService,
    private friendService: FriendService,
    private socketService: SocketService,
    private chatSessionService: ChatSessionService,
  ) { }

  init(): void {
    this.initChatSession().subscribe();

    this.friendService.getReceiveRequests().subscribe(({ data }: Result<FriendRequest[]>) => {
      this.globalData.receiveFriendRequests = data;
    });

    this.friendService.getSendRequests().subscribe(({ data }: Result<FriendRequest[]>) => {
      this.globalData.sendFriendRequests = data;
    });

    // 如果还没绑定邮箱
    // 因为之前有一批用户不需要绑定邮箱即可注册账号
    !this.globalData.user?.email && environment.production && this.overlay.presentAlert({
      header: '绑定电子邮箱',
      message: '绑定电子邮箱后方可继续使用',
      backdropDismiss: false,
      confirmHandler: () => this.overlay.presentModal({
        component: EmailBinderComponent
      }),
      cancelHandler: () => this.authService.logout().subscribe(() => {
        this.globalData.reset();
        this.tokenService.clear();
        this.socketService.disconnect();
        this.router.navigateByUrl('/user/login');
      })
    });
  }

  /**
   * 初始化聊天会话列表
   */
  initChatSession() {
    return forkJoin([
      this.chatSessionService.getChatSession().pipe(tap(({ data }: Result<ChatSession[]>) => {
        this.globalData.chatSessions = data;
      })),
      this.chatService.getReceiveRequests().pipe(tap(({ data }: Result<ChatRequest[]>) => {
        this.globalData.receiveChatRequests = data;
      })),
      this.chatService.getSendRequests().pipe(tap(({ data }: Result<ChatRequest[]>) => {
        this.globalData.sendChatRequests = data;
      }))
    ]);
  }
}
