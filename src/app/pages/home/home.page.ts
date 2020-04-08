import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { PopoverComponent } from '../../components/popover/popover.component';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private popoverController: PopoverController,private cookieService: CookieService) {
    console.log(this.cookieService.get("PHPSESSID"));

        const ws = new WebSocket('ws://localhost:8001')
        ws.onopen = (e) => {
          console.log(e)
      }
      ws.onmessage = (e) => {
          console.log(e)
      }
  }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
    });
    return await popover.present();
  }

}
