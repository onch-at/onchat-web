import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ModalController, PopoverController, ToastController } from '@ionic/angular';
import { ActionSheetButton, AlertOptions, ModalOptions, NotificationOptions, PopoverOptions } from '../common/interface';
import { NotificationController } from '../providers/notification.controller';
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
    private notificationCtrl: NotificationController
  ) { }

  private setDeactivate(deactivate: boolean) {
    this.globalData.canDeactivate = deactivate;
  }

  /**
   * 弹出消息通知
   * @param opts
   */
  presentNotification(opts: NotificationOptions) {
    if (document.hidden) {
      this.presentNativeNotification(opts);
    } else {
      this.notificationCtrl.create(opts).present();
    }
  }

  /**
   * 弹出原生通知
   * @param opts
   */
  presentNativeNotification(opts: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const { title, description, icon, url } = opts;
      navigator.serviceWorker.ready.then((registration: ServiceWorkerRegistration) => registration.showNotification(title, {
        body: description,
        badge: '/assets/icon/favicon.ico',
        icon: icon,
        requireInteraction: true,
        vibrate: [150, 75, 150],
        data: {
          url
        }
      }));
    }
  }

  /**
   * Present Toast
   * @param message 文字
   */
  async presentToast(message: string, duration: number = 2000): Promise<HTMLIonToastElement> {
    const toast = await this.toastCtrl.create({
      message,
      duration
    });

    await toast.present();
    return toast;
  }

  /**
   * Present Alert
   * @param opts 提示框参数
   */
  async presentAlert(opts: AlertOptions) {
    const { header, message, confirmHandler, cancelHandler, inputs, backdropDismiss } = opts;
    const alert = await this.alertCtrl.create({
      header,
      message,
      backdropDismiss,
      inputs,
      buttons: [
        {
          text: opts.cancelText || '取消',
          handler: data => cancelHandler?.(data)
        },
        {
          text: opts.confirmText || '确认',
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
  async presentActionSheet(buttons: (ActionSheetButton | string)[], header?: string): Promise<HTMLIonActionSheetElement> {
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
  async presentLoading(message: string = 'Loading…') {
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
   * @param opts 选项
   */
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    return modal;
  }

  /**
   * Present Popover
   * @param opts 选项
   * @returns
   */
  async presentPopover(opts: PopoverOptions) {
    const popover = await this.popoverCtrl.create(opts);
    popover.present();
    return popover;
  }

  /**
   * 如果未提供ID，则关闭顶层浮层
   * @param data
   * @param role
   * @param id
   */
  dismissLoading(data?: any, role?: string, id?: string) {
    this.loadingCtrl.dismiss(data, role, id);
  }

  /**
   * 如果未提供ID，则关闭顶层浮层
   * @param data
   * @param role
   * @param id
   */
  dismissPopover(data?: any, role?: string, id?: string) {
    this.popoverCtrl.dismiss(data, role, id);
  }

  /**
   * 如果未提供ID，则关闭顶层浮层
   * @param data
   * @param role
   * @param id
   */
  dismissModal(data?: any, role?: string, id?: string) {
    this.modalCtrl.dismiss(data, role, id);
  }

}
