import { Component, OnInit } from '@angular/core';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

  constructor(
    private overlayService: OverlayService,
  ) { }

  ngOnInit() {
  }

  showOverlayGlobalPanelCenter() {
    this.overlayService.presentNotification()
    // // config: OverlayConfig overlay的配置，配置显示位置，和滑动策略
    // const config = new OverlayConfig();
    // config.positionStrategy = this.overlay.position()
    //   .global() // 全局显示
    //   .centerHorizontally() // 水平居中
    //   .centerVertically(); // 垂直居中
    // config.hasBackdrop = true; // 设置overlay后面有一层背景, 当然你也可以设置backdropClass 来设置这层背景的class
    // const overlayRef = this.overlay.create(config); // OverlayRef, overlay层
    // overlayRef.backdropClick().subscribe(() => {
    //   // 点击了backdrop背景
    //   overlayRef.dispose();
    // });
    // // OverlayPanelComponent是动态组件
    // // 创建一个ComponentPortal，attach到OverlayRef，这个时候我们这个overlay层就显示出来了。
    // overlayRef.attach(new ComponentPortal(NotificationComponent, this.viewContainerRef));
    // // 监听overlayRef上的键盘按键事件
    // overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
    //   console.log(overlayRef._keydownEventSubscriptions + ' times');
    //   console.log(event);
    // });
  }

  rangeChange(e) {
    document.documentElement.style.fontSize = e.detail.value + '%'
  }

}
