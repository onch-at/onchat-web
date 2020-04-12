import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { SocketService } from 'src/app/services/socket.service';
import { PopoverComponent } from '../../components/popover/popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private popoverController: PopoverController, private socketService: SocketService) {
    // console.log(this.cookieService.get("PHPSESSID"));

  }

  ngOnInit() { }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
    });
    return await popover.present();
  }

  send() {
    this.socketService.message('Hello World!')
  }

}
