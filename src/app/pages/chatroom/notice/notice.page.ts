import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { slide } from 'src/app/animations/ionic.animation';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss']
})
export class NoticePage implements OnInit {
  readonly slide = slide;
  url: 'notice-list' | 'request-list';

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private globalData: GlobalData,
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
