import { Component, ViewChild } from '@angular/core';
import { AnimationBuilder, AnimationController, IonRouterOutlet, ViewWillEnter } from '@ionic/angular';
import { GlobalData } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss']
})
export class ContactPage implements ViewWillEnter {
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
    public globalData: GlobalData,
    private animationCtrl: AnimationController,
  ) { }

  ionViewWillEnter() {
    this.animation = this.routerOutlet.activatedRouteData.animation;
  }

}
