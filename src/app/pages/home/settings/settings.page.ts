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

  ngOnInit() { }

  showOverlayGlobalPanelCenter() {
    this.overlayService.presentNotification({
      icon: 'https://q.qlogo.cn/headimg_dl?dst_uin=1838491745&spec=5',
      title: 'Title标题',
      description: 'description 描述 description description description description description'
    });
  }

  rangeChange(e) {
    document.documentElement.style.fontSize = e.detail.value + '%'
  }

}
