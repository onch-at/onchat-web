import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EmailBinderComponent } from '../components/modals/email-binder/email-binder.component';
import { ChatRequest, ChatSession, FriendRequest, Result } from '../models/onchat.model';
import { ApiService } from './api.service';
import { GlobalData } from './global-data.service';
import { OverlayService } from './overlay.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class OnChatService {

  constructor(
    private router: Router,
    private globalData: GlobalData,
    private overlayService: OverlayService,
    private apiService: ApiService,
    private socketService: SocketService,
  ) { }

  init(): void {
    this.initChatSession().subscribe();

    this.apiService.getReceiveFriendRequests().subscribe((result: Result<FriendRequest[]>) => {
      if (result.data?.length) {
        this.globalData.receiveFriendRequests = result.data;
      }
    });

    this.apiService.getSendFriendRequests().subscribe((result: Result<FriendRequest[]>) => {
      if (result.data?.length) {
        this.globalData.sendFriendRequests = result.data;
      }
    });

    // 如果还没绑定邮箱
    // 因为之前有一批用户不需要绑定邮箱即可注册账号
    !this.globalData.user.email && this.overlayService.presentAlert({
      header: '绑定电子邮箱',
      message: '绑定电子邮箱后方可继续使用',
      backdropDismiss: false,
      confirmHandler: () => this.overlayService.presentModal({
        component: EmailBinderComponent
      }),
      cancelHandler: () => this.apiService.logout().subscribe(() => {
        this.router.navigateByUrl('/user/login');
        this.socketService.unload();
        this.globalData.reset();
      })
    });
  }

  /**
   * 初始化聊天会话列表
   */
  initChatSession() {
    this.globalData.chatSessionsPage = 1;

    return forkJoin([
      this.apiService.getChatSession().pipe(tap((result: Result<ChatSession[]>) => {
        this.globalData.chatSessions = result.data;
      })),
      this.apiService.getReceiveChatRequests().pipe(tap((result: Result<ChatRequest[]>) => {
        this.globalData.receiveChatRequests = result.data;
      })),
      this.apiService.getSendChatRequests().pipe(tap((result: Result<ChatRequest[]>) => {
        this.globalData.sendChatRequests = result.data;
        this.globalData.totalUnreadMsgCount();
      }))
    ]);
  }
}
