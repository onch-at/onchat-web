import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { horizontalSlideInRouteAnimation } from 'src/app/animations/slide.animation';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss'],
  animations: [horizontalSlideInRouteAnimation]
})
export class NoticePage implements OnInit {
  route: 'notice-list' | 'request-list';

  constructor(
    private apiService: ApiService,
    private globalData: GlobalData,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.route = this.location.path().includes('notice-list') ? 'notice-list' : 'request-list';

    const { receiveChatRequests, sendChatRequests, user } = this.globalData;
    receiveChatRequests.concat(sendChatRequests).some(o => (
      !o.readedList.includes(user.id)
    )) && this.apiService.readedChatRequests().subscribe();
  }

  segmentChange(event: any) {
    this.route = event.detail.value;
    this.router.navigateByUrl('/chatroom/notice/' + this.route);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.animation;
  }

}
