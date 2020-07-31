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
    this.overlayService.presentNotification({
      title: 'title',
      description: 'description'
    });
  }

  rangeChange(e) {
    document.documentElement.style.fontSize = e.detail.value + '%'
  }

}
