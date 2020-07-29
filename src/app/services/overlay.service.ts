import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { KeyValue } from '@angular/common';
import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { NotificationComponent } from '../components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  /** 气泡消息工具条的实例 */
  bubbleToolbarPopover: HTMLIonPopoverElement;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private overlay: Overlay,
  ) { }


  presentNotification() {
    // config: OverlayConfig overlay的配置，配置显示位置，和滑动策略
    const config = new OverlayConfig();
    config.positionStrategy = this.overlay.position()
      .global() // 全局显示
      .centerHorizontally() // 水平居中
      .top(); // 垂直居中


    // config.hasBackdrop = true; // 设置overlay后面有一层背景, 当然你也可以设置backdropClass 来设置这层背景的class
    const overlayRef = this.overlay.create(config); // OverlayRef, overlay层
    // overlayRef.backdropClick().subscribe(() => {
    //   // 点击了backdrop背景
    //   overlayRef.dispose();
    // });
    // OverlayPanelComponent是动态组件
    // 创建一个ComponentPortal，attach到OverlayRef，这个时候我们这个overlay层就显示出来了。
    const ref = overlayRef.attach(new ComponentPortal(NotificationComponent));
    ref.instance.title = '666';
    ref.instance.overlayRef = overlayRef
    overlayRef.overlayElement.addEventListener('click', () => {
      console.log(111)
      // overlayRef.dispose();
      // positionStrategy.top(0 + 'px')
    })
  }

  /**
   * 弹出文字Toast
   * @param message 文字
   */
  async presentMsgToast(message: string, duration: number = 2000): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message,
      duration,
      color: 'dark'
    });

    toast.present();
    return toast;
  }

  /**
   * 弹出文字提示框
   * @param header 标题
   * @param message 提示文字
   * @param confirmHandler 确认时的回调函数
   * @param cancelHandler 取消时的回调函数
   */
  async presentMsgAlert(header: string, message: string, confirmHandler: CallableFunction, cancelHandler?: CallableFunction) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: '取消',
          handler: () => { cancelHandler && cancelHandler(); }
        }, {
          text: '确认',
          handler: () => confirmHandler()
        }
      ]
    });

    alert.present();
    return alert;
  }

  /**
   * 弹出带有Input的文字提示框
   * @param header 标题
   * @param inputs inpust组
   * @param confirmHandler 确认时的回调函数
   * @param cancelHandler 取消时的回调函数
   */
  async presentInputAlert(header: string, inputs: any[], confirmHandler: CallableFunction, cancelHandler?: CallableFunction): Promise<HTMLIonAlertElement> {
    const alert = await this.alertController.create({
      header,
      inputs,
      buttons: [
        {
          text: '取消',
          handler: () => { cancelHandler && cancelHandler(); }
        }, {
          text: '确认',
          handler: (data: KeyValue<string, any>) => confirmHandler(data)
        }
      ]
    });

    alert.present();
    return alert;
  }

}
