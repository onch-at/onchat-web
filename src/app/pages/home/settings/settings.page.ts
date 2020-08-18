import { Component, OnInit } from '@angular/core';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

  constructor(
    private overlayService: OverlayService,
    private onChatService: OnChatService,
  ) { }

  ngOnInit() {
  }

  showOverlayGlobalPanelCenter() {
    this.overlayService.presentNotification({
      iconUrl: 'https://q.qlogo.cn/headimg_dl?dst_uin=1838491745&spec=5',
      title: 'Title',
      description: 'description description description description description description'
    });
  }

  rangeChange(e) {
    document.documentElement.style.fontSize = e.detail.value + '%'
  }

}
