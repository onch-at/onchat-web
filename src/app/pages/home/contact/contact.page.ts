import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { horizontalSlideAnimation } from 'src/app/animations/slide.animation';
import { GlobalDataService } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  animations: [
    horizontalSlideAnimation
  ]
})
export class ContactPage implements OnInit {

  constructor(
    public globalDataService: GlobalDataService,
  ) { }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

}
