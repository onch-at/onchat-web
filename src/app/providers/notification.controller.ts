import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable } from '@angular/core';
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

  dismissTimeout: number;

  constructor(private overlay: Overlay) {
    this.overlayConfig.positionStrategy = this.overlay.position().global().centerHorizontally().top();
  }

  create({ title, description, iconUrl, duration, tapHandler }: Opt): NotificationController {
    this.title = title || '';
    this.description = description || '';
    this.iconUrl = iconUrl || '';
    this.duration = duration || 3000;

    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(this.overlayConfig);
    }

    return this;
  }

  present() {
    this.dismissTimeout != null && this.clearDismissTimeout();

    if (!this.componentRef) {
      this.componentRef = this.overlayRef.attach(new ComponentPortal(NotificationComponent));
      this.componentRef.instance.overlayRef = this.overlayRef;
    }

    this.componentRef.instance.title = this.title;
    this.componentRef.instance.description = this.description;
    this.componentRef.instance.iconUrl = this.iconUrl;
    this.componentRef.instance.overlayDuration = this.duration;

    this.dismissTimeout = window.setTimeout(() => {
      this.dismiss();
    }, this.duration);
  }

  private clearDismissTimeout(): void {
    clearTimeout(this.dismissTimeout);
    this.dismissTimeout = null;
  }

  async dismiss() {
    await this.componentRef.instance.dismiss();
    this.componentRef = null;
    this.overlayRef = null;
    return this.clearDismissTimeout();
  }
}

interface Opt {
  title: string;
  description: string;
  iconUrl: string;
  duration: number;
  tapHandler: () => void;
}
