import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActionSheetController, ActionSheetOptions, AlertController, LoadingController, ModalController, ModalOptions, PopoverController, PopoverOptions, ToastController } from '@ionic/angular';
import { AlertOptions, NotificationOptions, SafeAny } from '../common/interface';
import { NAVIGATOR } from '../common/token';
import { NotificationController } from '../controllers/notification.controller';
import { GlobalData } from './global-data.service';

/**
 * 浮层服务
 * 这里代理了一些常用的Ionic浮层控制器
 */
@Injectable({
  providedIn: 'root'
})
export class Overlay {

  constructor(
    private globalData: GlobalData,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private popoverCtrl: PopoverController,
    private actionSheetCtrl: ActionSheetController,
    private notificationCtrl: NotificationController,
    @Inject(DOCUMENT) private document: Document,
    @Inject(NAVIGATOR) private navigator: Navigator
  ) { }

  private setDeactivate(deactivate: boolean) {
    this.globalData.canDeactivate = deactivate;
  }

  /**
   * 弹出消息通知
   * @param options
   */
  notification(options: NotificationOptions) {
    if (this.document.hidden) {
      this.nativeNotification(options);
    } else {
      this.notificationCtrl.create(options).present();
    }
  }

  /**
   * 弹出原生通知
   * @param options
   */
  private nativeNotification(options: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const { title, description, icon, url } = options;
      this.navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration) => registration.showNotification(title, {
        body: description,
        badge: '/assets/icon/favicon.ico',
        icon,
        requireInteraction: true,
        vibrate: [150, 75, 150],
        data: {
          onActionClick: {
            default: { operation: 'navigateLastFocusedOrOpen', url: url }
          }
        }
      }));
    }
  }

  /**
   * Present Toast
   * @param message 文字
   */
  async toast(message: string, duration: number = 2000): Promise<HTMLIonToastElement> {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });

    await toast.present();
    return toast;
  }

  /**
   * Present Alert
   * @param options 提示框参数
   */
  async alert(options: AlertOptions) {
    const { header, message, confirmHandler, cancelHandler, inputs, backdropDismiss } = options;
    const alert = await this.alertCtrl.create({
      header,
      message,
      backdropDismiss,
      inputs,
      buttons: [
        {
          text: options.cancelText || '取消',
          handler: data => cancelHandler?.(data)
        },
        {
          text: options.confirmText || '确认',
          handler: data => confirmHandler?.(data)
        }
      ]
    });

    alert.onWillDismiss().then(() => this.setDeactivate(true));
    await alert.present();
    this.setDeactivate(false);
    return alert;
  }

  /**
   * Present Action Sheet
   * @param buttons 按钮组
   * @param header 标头文字
   */
  async actionSheet(buttons: ActionSheetOptions['buttons'], header?: string): Promise<HTMLIonActionSheetElement> {
    const actionSheet = await this.actionSheetCtrl.create({
      header,
      cssClass: 'ion-action-sheet',
      buttons
    });

    actionSheet.onWillDismiss().then(() => this.setDeactivate(true));
    await actionSheet.present();
    return actionSheet;
  }

  /**
   * Present Loading
   * @param message 文字
   */
  async loading(message: string = 'Loading…') {
    const loading = await this.loadingCtrl.create({
      cssClass: 'ion-loading',
      spinner: 'crescent',
      message,
    });

    await loading.present();
    return loading;
  }

  /**
   * Present Modal
   * @param options 选项
   */
  async modal(options: ModalOptions) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    return modal;
  }

  /**
   * Present Popover
   * @param options 选项
   * @returns
   */
  async popover(options: PopoverOptions) {
    const popover = await this.popoverCtrl.create(options);
    popover.present();
    return popover;
  }

  /**
   * 如果未提供ID，则关闭顶层浮层
   * @param data
   * @param role
   * @param id
   */
  dismissLoading(data?: SafeAny, role?: string, id?: string) {
    this.loadingCtrl.dismiss(data, role, id);
  }

  /**
   * 如果未提供ID，则关闭顶层浮层
   * @param data
   * @param role
   * @param id
   */
  dismissPopover(data?: SafeAny, role?: string, id?: string) {
    this.popoverCtrl.dismiss(data, role, id);
  }

  /**
   * 如果未提供ID，则关闭顶层浮层
   * @param data
   * @param role
   * @param id
   */
  dismissModal(data?: SafeAny, role?: string, id?: string) {
    this.modalCtrl.dismiss(data, role, id);
  }

}
