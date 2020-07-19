import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OnChatService } from 'src/app/services/onchat.service';
import { PopoverComponent } from '../../components/popover/popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  constructor(
    private popoverController: PopoverController,
    public onChatService: OnChatService,
  ) { }

  ngOnInit() { }

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: event,
    });
    return await popover.present();
  }

}
