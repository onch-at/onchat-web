import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationController {
  private overlayConfig = new OverlayConfig();
  overlayRef: OverlayRef;
  componentRef: ComponentRef<NotificationComponent>;

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

  dismissTimeout: number;

  subscription: Subscription;

  constructor(private overlay: Overlay) {
    this.overlayConfig.positionStrategy = this.overlay.position().global().centerHorizontally().top();
  }

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

  present(): NotificationController {
    this.dismissTimeout != null && this.clearDismissTimeout();

    if (!this.componentRef) {
      this.componentRef = this.overlayRef.attach(new ComponentPortal(NotificationComponent));
      this.componentRef.instance.overlayRef = this.overlayRef;
    }

    this.componentRef.instance.title = this.title;
    this.componentRef.instance.description = this.description;
    this.componentRef.instance.iconUrl = this.iconUrl;
    this.componentRef.instance.overlayDuration = this.duration;
    this.componentRef.instance.tapHandler = this.tapHandler;

    this.subscription && this.subscription.unsubscribe();
    this.subscription = this.componentRef.instance.onDismiss().subscribe(() => {
      this.componentRef = null;
      this.overlayRef = null;
      this.clearDismissTimeout();
      this.subscription.unsubscribe();
      this.subscription = null;
    });

    this.dismissTimeout = window.setTimeout(() => {
      this.dismiss();
    }, this.duration);

    return this;
  }

  async dismiss(): Promise<void> {
    await this.componentRef.instance.dismiss();
    this.componentRef = null;
    this.overlayRef = null;
    return this.clearDismissTimeout();
  }

  private clearDismissTimeout(): void {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = null;
  }
}

export interface NotificationOptions {
  title: string;
  description?: string;
  iconUrl?: string;
  duration?: number;
  tapHandler?: (event: Event) => void;
}
