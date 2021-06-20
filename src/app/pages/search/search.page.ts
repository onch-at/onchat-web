import { Component, OnInit, ViewChild } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { slide } from 'src/app/animations/ionic.animation';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  readonly slide = slide;
  pathname: string;

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor() { }

  ngOnInit() {
  }

  segmentChange(event: any) {
    // this.pathname = event.detail.value;
    // this.router.navigateByUrl(this.pathname, { skipLocationChange: true });
  }

}
