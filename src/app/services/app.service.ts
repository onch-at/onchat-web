import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SwPush, SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { filter, mergeMap } from 'rxjs/operators';
import { ResultCode, SocketEvent } from '../common/enum';
import { LOCATION, WINDOW } from '../common/token';
import { Result } from '../models/onchat.model';
import { AuthService } from './apis/auth.service';
import { FeedbackService } from './feedback.service';
import { GlobalData } from './global-data.service';
import { Overlay } from './overlay.service';
import { SocketService } from './socket.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class Application {

  constructor(
    private router: Router,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private overlay: Overlay,
    private globalData: GlobalData,
    private authService: AuthService,
    private tokenService: TokenService,
    private socketService: SocketService,
    private feedbackService: FeedbackService,
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCATION) private location: Location,
  ) {
    this.socketService.initialized.pipe(
      filter(({ code }: Result) => code === ResultCode.Unauthorized),
      mergeMap(() => this.authService.refresh(this.tokenService.folder.refresh))
    ).subscribe(({ code, data }: Result<string>) => {
      if (code !== ResultCode.Success) {
        return this.logout();
      }

      this.tokenService.store(data);
      this.socketService.connect();
    });
  }

  logout() {
    this.globalData.reset();
    this.tokenService.clear();
    this.socketService.disconnect();
    this.router.navigateByUrl('/user/login');
  }

  /**
   * 检测路由导航事件
   */
  detectNavigation() {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart:
          this.globalData.navigating = true;
          break;

        case event instanceof NavigationCancel:
          this.feedbackService.slightVibrate(); // 如果路由返回被取消，就震动一下，表示阻止

        case event instanceof NavigationEnd:
        case event instanceof NavigationError:
          this.globalData.navigating = false;
          break;
      }
    });
  }

  /**
   * 检测Socket.IO连接状态
   */
  detectSocketConnectStatus() {
    // 连接断开时
    this.socketService.on(SocketEvent.Disconnect).pipe(
      // 用户登录后且客户端在前台
      filter(() => this.globalData.user !== null && !this.document.hidden),
    ).subscribe(() => {
      this.overlay.presentToast('OnChat: 与服务器断开连接！');
    });

    // 连接失败时
    this.socketService.on(SocketEvent.ReconnectError).subscribe(() => {
      this.overlay.presentToast('OnChat: 服务器连接失败！');
    });

    // 重连成功时
    this.socketService.on(SocketEvent.Reconnect).subscribe(() => {
      this.overlay.presentToast('OnChat: 与服务器重连成功！');
    });
  }

  /**
   * 检测更新
   */
  detectUpdate() {
    this.swUpdate.unrecoverable.subscribe(() => this.overlay.presentAlert({
      header: '应用程序已损坏',
      message: '即将重启以更新到新版本！',
      backdropDismiss: false,
    }).then(() => setTimeout(() => this.location.reload(), 2000)));

    this.swUpdate.available.subscribe((event: UpdateAvailableEvent) => {
      console.log('current version is', event.current);
      console.log('available version is', event.available);
      this.overlay.presentAlert({
        header: '新版本已就绪',
        message: '是否立即重启以更新到新版本？',
        backdropDismiss: false,
        confirmHandler: () => {
          this.overlay.presentLoading('Installing…');
          this.swUpdate.activateUpdate().then(() => this.location.reload());
        }
      })
    });
  }

  /**
   * 初始化原生通知
   */
  initNotification() {
    if ('Notification' in this.window) {
      const granted = 'granted';
      Notification.permission !== granted && Notification.requestPermission().then((permission: string) => {
        permission === granted && this.overlay.presentToast('OnChat: 通知权限授权成功！');
      });

      this.swPush.notificationClicks.subscribe(event => {
        const { url } = event.notification.data;
        this.router.navigateByUrl(url);
        this.window.focus();
      });
    }
  }
}
