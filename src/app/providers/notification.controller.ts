import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationController {
  private overlayConfig = new OverlayConfig();
  private overlayRef: OverlayRef;
  private componentRef: ComponentRef<NotificationComponent>;

  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 图标URL */
  iconUrl: string;
  /** 持续时间 */
  duration: number;
  /** 点击事件处理函数 */
  tapHandler: (event: Event) => void;
  /** 通知关闭计时器 */
  private dismissTimeout: number;
  /** 一个订阅器 */
  private subscription: Subscription;

  constructor(private overlay: Overlay) {
    // 全局显示，水平居中，位于顶部
    this.overlayConfig.positionStrategy = this.overlay.position().global().centerHorizontally().top();
  }

  /**
   * 创建一个通知
   * @param opts
   */
  create(opts: NotificationOptions): NotificationController {
    this.title = opts.title;
    this.description = opts.description || '';
    this.iconUrl = opts.iconUrl || '';
    this.duration = opts.duration || 3000;
    this.tapHandler = opts.tapHandler || (() => { });

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(this.overlayConfig);
    }

    return this;
  }

  /**
   * 弹出通知
   * 如果通知已经存在，则更新内容并重新计时
   */
  present(): NotificationController {
    this.dismissTimeout != null && this.clearDismissTimeout();
    this.subscription && this.subscription.unsubscribe();

    if (!this.componentRef) {
      this.componentRef = this.overlayRef.attach(new ComponentPortal(NotificationComponent));
      this.componentRef.instance.overlayRef = this.overlayRef;
    }

    this.componentRef.instance.title = this.title;
    this.componentRef.instance.description = this.description;
    this.componentRef.instance.iconUrl = this.iconUrl;
    this.componentRef.instance.overlayDuration = this.duration;
    this.componentRef.instance.tapHandler = this.tapHandler;

    // 监听通知关闭事件
    this.subscription = this.componentRef.instance.onDismiss().subscribe(() => {
      this.clearRef();
      this.clearDismissTimeout();
      this.subscription.unsubscribe();
      this.subscription = null;
    });

    // 开始计时
    this.dismissTimeout = window.setTimeout(() => {
      this.dismiss();
    }, this.duration);

    return this;
  }

  /**
   * 关闭通知
   */
  dismiss(): Observable<void> {
    this.componentRef.instance.dismiss().subscribe(() => {
      this.clearRef();
      this.clearDismissTimeout();
    });

    return this.componentRef.instance.dismiss();
  }

  private clearDismissTimeout(): void {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = null;
  }

  private clearRef(): void {
    this.componentRef = null;
    this.overlayRef = null;
  }
}

export interface NotificationOptions {
  /** 标题 */
  title: string;
  /** 描述 */
  description?: string;
  /** 图标URL */
  iconUrl?: string;
  /** 持续时间 */
  duration?: number;
  /** 点击事件处理 */
  tapHandler?: (event: Event) => void;
}
