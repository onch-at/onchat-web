import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss'],
})
export class HomeMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {

  }

  navigate(commands: any[]) {
    this.router.navigate(commands);
  }

  dismiss() {
    this.popoverController.dismiss();
  }

}
