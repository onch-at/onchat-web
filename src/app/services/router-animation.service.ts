import { Injectable } from '@angular/core';
import { AnimationBuilder, AnimationController, IonRouterOutlet } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RouterAnimation {

  constructor(
    private animationCtrl: AnimationController,
  ) { }

  /**
   * 淡入淡出路由转场动画
   * @param _
   * @param opts
   */
  fade: AnimationBuilder = (_, opts) => {
    const { enteringEl, leavingEl } = opts;
    const animation = this.animationCtrl.create().duration(250).easing('ease-out');
    const enteringAnimation = this.animationCtrl.create().addElement(enteringEl).fromTo('opacity', 0, 1);
    const leavingAnimation = this.animationCtrl.create().addElement(leavingEl).fromTo('opacity', 1, 0);

    return animation.addAnimation([enteringAnimation, leavingAnimation]);
  };

  /**
   * 左右滑动路由转场动画
   * @param outlet
   */
  slide: (outlet: IonRouterOutlet) => AnimationBuilder = (outlet: IonRouterOutlet) => (baseEl: HTMLIonRouterOutletElement, opts) => {
    const { enteringEl, leavingEl } = opts;
    const { activatedRouteData } = outlet;
    const animationIndex = +baseEl.dataset.animation;
    const animation = this.animationCtrl.create().duration(300).easing('ease-out');
    const enteringAnimation = this.animationCtrl.create().addElement(enteringEl).beforeRemoveClass('ion-page-invisible');
    const leavingAnimation = this.animationCtrl.create().addElement(leavingEl).beforeRemoveClass('ion-page-invisible');

    if (animationIndex > activatedRouteData.animation) {
      enteringAnimation.fromTo('transform', 'translateX(-100%)', 'translateX(0)');
      leavingAnimation.fromTo('transform', 'translateX(0)', 'translateX(100%)');
    } else {
      enteringAnimation.fromTo('transform', 'translateX(100%)', 'translateX(0)');
      leavingAnimation.fromTo('transform', 'translateX(0)', 'translateX(-100%)');
    }

    baseEl.dataset.animation = activatedRouteData.animation;
    return animation.addAnimation([enteringAnimation, leavingAnimation]);
  };
}
