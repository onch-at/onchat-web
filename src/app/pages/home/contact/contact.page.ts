import { Component, ViewChild } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { slide } from 'src/app/animations/ionic.animation';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss']
})
export class ContactPage {
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;
  readonly slide = slide;

  constructor(
    public globalData: GlobalData
  ) { }

}
