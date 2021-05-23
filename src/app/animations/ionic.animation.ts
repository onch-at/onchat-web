import { AnimationBuilder, createAnimation, IonRouterOutlet } from '@ionic/angular';

/**
 * 淡入淡出路由转场动画
 */
export const fade: AnimationBuilder = (_, opts) => {
  const { enteringEl, leavingEl } = opts;
  const animation = createAnimation().duration(250).easing('ease-out');
  const enteringAnimation = createAnimation().addElement(enteringEl).fromTo('opacity', 0, 1);
  const leavingAnimation = createAnimation().addElement(leavingEl).fromTo('opacity', 1, 0);

  return animation.addAnimation([enteringAnimation, leavingAnimation]);
};

/**
 * 左右滑动路由转场动画
 * @param outlet
 */
export const slide: (outlet: IonRouterOutlet) => AnimationBuilder = (outlet: IonRouterOutlet) => (baseEl: HTMLIonRouterOutletElement, opts) => {
  const { activatedRouteData } = outlet;
  const { enteringEl, leavingEl } = opts;
  const animationIndex = +baseEl.dataset.animation;
  const animation = createAnimation().duration(300).easing('ease-out');
  const enteringAnimation = createAnimation().addElement(enteringEl).beforeRemoveClass('ion-page-invisible');
  const leavingAnimation = createAnimation().addElement(leavingEl).beforeRemoveClass('ion-page-invisible');

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