import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EmailBinderComponent } from '../components/modals/email-binder/email-binder.component';
import { ChatRequest, ChatSession, FriendRequest, Result } from '../models/onchat.model';
import { ApiService } from './api.service';
import { GlobalData } from './global-data.service';
import { Overlay } from './overlay.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class OnChatService {

  constructor(
    private router: Router,
    private overlay: Overlay,
    private globalData: GlobalData,
    private apiService: ApiService,
    private socketService: SocketService,
  ) { }

  init(): void {
    this.initChatSession().subscribe();

    this.apiService.getReceiveFriendRequests().subscribe(({ data }: Result<FriendRequest[]>) => {
      if (data?.length) {
        this.globalData.receiveFriendRequests = data;
      }
    });

    this.apiService.getSendFriendRequests().subscribe(({ data }: Result<FriendRequest[]>) => {
      if (data?.length) {
        this.globalData.sendFriendRequests = data;
      }
    });

    // 如果还没绑定邮箱
    // 因为之前有一批用户不需要绑定邮箱即可注册账号
    !this.globalData.user.email && environment.production && this.overlay.presentAlert({
      header: '绑定电子邮箱',
      message: '绑定电子邮箱后方可继续使用',
      backdropDismiss: false,
      confirmHandler: () => this.overlay.presentModal({
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
    return forkJoin([
      this.apiService.getChatSession().pipe(tap(({ data }: Result<ChatSession[]>) => {
        this.globalData.chatSessions = data;
      })),
      this.apiService.getReceiveChatRequests().pipe(tap(({ data }: Result<ChatRequest[]>) => {
        this.globalData.receiveChatRequests = data;
      })),
      this.apiService.getSendChatRequests().pipe(tap(({ data }: Result<ChatRequest[]>) => {
        this.globalData.sendChatRequests = data;
      }))
    ]);
  }
}
