import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../../components/popover/popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public popoverController: PopoverController) {}

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
    });
    return await popover.present();
  }

}
