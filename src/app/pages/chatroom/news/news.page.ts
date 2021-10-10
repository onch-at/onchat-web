import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { slide } from 'src/app/animations/ionic.animation';
import { SafeAny } from 'src/app/common/interfaces';
import { ChatService } from 'src/app/services/apis/chat.service';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-notice',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss']
})
export class NewsPage implements OnInit, OnDestroy {
  readonly slide = slide;
  pathname: string;

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private globalData: GlobalData,
  ) { }

  ngOnInit() {
    this.pathname = this.router.routerState.snapshot.url;
  }

  ngOnDestroy() {
    const { receiveChatRequests, sendChatRequests, user } = this.globalData;
    receiveChatRequests?.concat(sendChatRequests).some(o => (
      !o.readedList.includes(user.id)
    )) && this.chatService.readedRequests().subscribe();

    this.globalData.readedChatRequest();
  }

  segmentChange(event: SafeAny) {
    this.pathname = event.detail.value;
    this.router.navigateByUrl(this.pathname, { skipLocationChange: true });
  }

}
