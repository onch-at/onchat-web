import { Inject, Injectable } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SwPush, SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { filter, tap } from 'rxjs/operators';
import { ResultCode, SocketEvent } from '../common/enum';
import { LOCATION, WINDOW } from '../common/token';
import { Result, TokenPayload } from '../models/onchat.model';
import { FeedbackService } from './feedback.service';
import { GlobalData } from './global-data.service';
import { Overlay } from './overlay.service';
import { SocketService } from './socket.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  /** 令牌刷新器 */
  private refresher: number = null;

  constructor(
    private router: Router,
    private swPush: SwPush,
    private swUpdate: SwUpdate,
    private overlay: Overlay,
    private globalData: GlobalData,
    private tokenService: TokenService,
    private socketService: SocketService,
    private feedbackService: FeedbackService,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCATION) private location: Location,
  ) {
    this.socketService.initialized.subscribe(() => {
      const playload = this.tokenService.parse(this.tokenService.folder.access);
      this.startRefreshTokenTask(playload);
    });

    this.socketService.on(SocketEvent.RefreshToken).subscribe(({ code, data }: Result<string>) => {
      if (code !== ResultCode.Success) {
        return this.signOut();
      }

      const playload = this.tokenService.parse(data);

      this.tokenService.store(data);
      this.startRefreshTokenTask(playload);
    });
  }

  /**
  * 开启令牌刷新任务
  * @param playload
  */
  startRefreshTokenTask(playload: TokenPayload) {
    // this.refresher = this.window.setTimeout(() => {
    //   this.socketService.refreshToken();
    // }, playload.exp * 1000 - Date.now() - 60000); // 提前一分钟
  }

  /**
   * 关闭令牌刷新任务
   */
  stopRefreshTokenTask() {
    this.refresher && this.window.clearTimeout(this.refresher);
  }

  /**
  * 跳转到登录页
  */
  signOut() {
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
      tap(() => this.stopRefreshTokenTask()),
      filter(() => this.globalData.user !== null)
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
