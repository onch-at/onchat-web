import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { horizontalSlideInRouteAnimation } from 'src/app/animations/slide.animation';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
  animations: [horizontalSlideInRouteAnimation]
})
export class NoticePage implements OnInit {
  route: 'notice-list' | 'request-list';

  constructor(
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.route = this.location.path().includes('notice-list') ? 'notice-list' : 'request-list';
  }

  segmentChange(event: any) {
    this.route = event.detail.value;
    this.router.navigateByUrl('/chatroom/notice/' + this.route);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }

}
