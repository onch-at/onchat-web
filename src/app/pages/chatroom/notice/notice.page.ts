import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationBuilder, AnimationController, IonRouterOutlet, ViewWillEnter } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.page.html',
  styleUrls: ['./notice.page.scss']
})
export class NoticePage implements OnInit, ViewWillEnter {
  url: 'notice-list' | 'request-list';
  animation: number = 0;

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  routerAnimation: AnimationBuilder = (_, opts) => {
    const { activatedRouteData } = this.routerOutlet;
    const { enteringEl, leavingEl } = opts;
    const animation = this.animationCtrl.create().duration(300).easing('ease-out');
    const enteringAnimation = this.animationCtrl.create().addElement(enteringEl).beforeRemoveClass('ion-page-invisible');
    const leavingAnimation = this.animationCtrl.create().addElement(leavingEl).beforeRemoveClass('ion-page-invisible');

    if (this.animation > activatedRouteData.animation) {
      enteringAnimation.fromTo('transform', 'translateX(-100%)', 'translateX(0%)');
      leavingAnimation.fromTo('transform', 'translateX(0%)', 'translateX(100%)');
    } else {
      enteringAnimation.fromTo('transform', 'translateX(100%)', 'translateX(0%)');
      leavingAnimation.fromTo('transform', 'translateX(0%)', 'translateX(-100%)');
    }

    this.animation = activatedRouteData.animation;
    return animation.addAnimation([enteringAnimation, leavingAnimation]);
  };

  constructor(
    private apiService: ApiService,
    private globalData: GlobalData,
    private animationCtrl: AnimationController,
    private router: Router
  ) { }

  ngOnInit() {
    this.url = this.router.routerState.snapshot.url.includes('notice-list') ? 'notice-list' : 'request-list';

    const { receiveChatRequests, sendChatRequests, user } = this.globalData;
    receiveChatRequests.concat(sendChatRequests).some(o => (
      !o.readedList.includes(user.id)
    )) && this.apiService.readedChatRequests().subscribe();
  }

  ionViewWillEnter() {
    this.animation = this.routerOutlet.activatedRouteData.animation;
  }

  segmentChange(event: any) {
    this.url = event.detail.value;
    this.router.navigateByUrl('/chatroom/notice/' + this.url, { skipLocationChange: true });
  }

}
