import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss'],
})
export class HomeMenuComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {

  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
