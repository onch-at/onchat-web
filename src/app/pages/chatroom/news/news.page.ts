import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { slide } from 'src/app/animations/ionic.animation';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-notice',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss']
})
export class NewsPage implements OnInit {
  readonly slide = slide;
  pathname: string;

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private globalData: GlobalData,
  ) { }

  ngOnInit() {
    this.pathname = this.router.routerState.snapshot.url;
    const { receiveChatRequests, sendChatRequests, user } = this.globalData;
    const hasUnreaded = receiveChatRequests.concat(sendChatRequests).some(o => (
      !o.readedList.includes(user.id)
    ));

    hasUnreaded && this.apiService.readedChatRequests().subscribe();
    this.globalData.readedChatRequest();
  }

  segmentChange(event: any) {
    this.pathname = event.detail.value;
    this.router.navigateByUrl(this.pathname, { skipLocationChange: true });
  }

}
