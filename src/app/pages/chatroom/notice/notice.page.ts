import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { RouterAnimation } from 'src/app/services/router-animation.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss']
})
export class NoticePage implements OnInit {
  url: 'notice-list' | 'request-list';

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private globalData: GlobalData,
    public routerAnimation: RouterAnimation,
  ) { }

  ngOnInit() {
    this.url = this.router.routerState.snapshot.url.includes('notice-list') ? 'notice-list' : 'request-list';

    const { receiveChatRequests, sendChatRequests, user } = this.globalData;
    receiveChatRequests.concat(sendChatRequests).some(o => (
      !o.readedList.includes(user.id)
    )) && this.apiService.readedChatRequests().subscribe();

    this.globalData.readedChatRequest();
  }

  segmentChange(event: any) {
    this.url = event.detail.value;
    this.router.navigateByUrl('/chatroom/notice/' + this.url, { skipLocationChange: true });
  }

}
