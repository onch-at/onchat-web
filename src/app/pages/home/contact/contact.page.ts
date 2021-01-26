import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { horizontalSlideInRouteAnimation } from 'src/app/animations/slide.animation';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  animations: [horizontalSlideInRouteAnimation]
})
export class ContactPage implements OnInit {

  constructor(
    public globalData: GlobalData,
  ) { }

  ngOnInit() { }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }

}
