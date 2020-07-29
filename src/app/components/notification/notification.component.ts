import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  @Input() title: string = 'title';
  @Input() overlayRef: OverlayRef;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      this.overlayRef && this.overlayRef.dispose();
    }, 10000);
  }

}
