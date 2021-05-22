import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { GlobalData } from 'src/app/services/global-data.service';
import { RouterAnimation } from 'src/app/services/router-animation.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss']
})
export class ContactPage {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    public globalData: GlobalData,
    public routerAnimation: RouterAnimation
  ) { }

}
