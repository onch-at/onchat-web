import { Injectable } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AlertOptions, NotificationOptions } from '../common/interface';
import { NotificationController } from '../providers/notification.controller';
import { GlobalData } from './global-data.service';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  constructor(
    private globalData: GlobalData,
    private toastController: ToastController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private notificationController: NotificationController
  ) { }

  private setDeactivate(deactivate: boolean) {
    this.globalData.canDeactivate = deactivate;
  }

  /**
   * 弹出消息通知
   * @param opts
   */
  presentNotification(opts: NotificationOptions) {
    return this.notificationController.create(opts).present();
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
   * 弹出文字Toast
   * @param message 文字
   */
  async presentToast(message: string, duration: number = 2000): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message,
      duration
    });

    await toast.present();
    return toast;
  }

  /**
   * 弹出提示框
   * @param opts 提示框参数
   */
  async presentAlert(opts: AlertOptions) {
    const { header, message, confirmHandler, cancelHandler, inputs, backdropDismiss } = opts;
    const alert = await this.alertController.create({
      header,
      message,
      backdropDismiss,
      inputs,
      buttons: [
        {
          text: '取消',
          handler: data => cancelHandler && cancelHandler(data)
        },
        {
          text: '确认',
          handler: data => confirmHandler(data)
        }
      ]
    });

    alert.onWillDismiss().then(() => this.setDeactivate(true));
    await alert.present();
    this.setDeactivate(false);
    return alert;
  }

  /**
   * 弹出Action Sheet
   * @param header 标头文字
   * @param buttons 按钮组
   */
  async presentActionSheet(header: string = undefined, buttons: any[]): Promise<HTMLIonActionSheetElement> {
    const actionSheet = await this.actionSheetController.create({
      header,
      cssClass: 'ion-action-sheet',
      buttons
    });

    actionSheet.onWillDismiss().then(() => this.setDeactivate(true));
    await actionSheet.present();
    return actionSheet;
  }

  /**
   * 弹出加载中
   * @param message 文字
   */
  async presentLoading(message: string = 'Loading…') {
    const loading = await this.loadingController.create({
      cssClass: 'ion-loading',
      spinner: 'crescent',
      message,
    });

    await loading.present();
    return loading;
  }

}
