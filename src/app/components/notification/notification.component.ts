import { OverlayRef } from '@angular/cdk/overlay';
import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Animation, AnimationController, Gesture, GestureController, GestureDetail } from '@ionic/angular';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  /** 标题 */
  @Input() title: string;
  /** 描述 */
  @Input() description: string;
  /** 图标URL */
  @Input() icon: string;
  /** 浮层 */
  @Input() overlayRef: OverlayRef;
  /** 浮层持续时间 */
  @Input() overlayDuration: number;
  /** 点击跳转URL */
  @Input() url: string;
  /** 点击事件处理函数 */
  @Input() handler: (e: Event) => void;
  /** 当前Notification的元素 */
  element: HTMLElement;

  private dismiss$: Subject<void> = new Subject();
  /** 动画 */
  private animation: Animation;
  /** 手势 */
  private gesture: Gesture;

  /** 判断是否为链接 */
  isLink = () => /^(\/|http:\/\/|https:\/\/)/i.test(this.icon);

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private animationCtrl: AnimationController,
    private gestureCtrl: GestureController
  ) { }

  ngOnInit() {
    this.element = this.elementRef.nativeElement.querySelector('.notification');

    this.animation = this.animationCtrl.create()
      .addElement(this.elementRef.nativeElement)
      .duration(200)
      .fromTo('transform', 'translateY(0)', 'translateY(-100%)')
      .fromTo('opacity', 1, .5)
      .easing('ease-out');
    this.animation.progressStart(false);

    this.gesture = this.gestureCtrl.create({
      el: this.elementRef.nativeElement,
      threshold: 0,
      gestureName: 'square-drag',
      onMove: (event: GestureDetail) => this.onMove(event),
      onEnd: (event: GestureDetail) => this.onEnd(event)
    });
    this.gesture.enable(true);
  }

  /**
   * 手势移动时
   * @param event
   */
  private onMove(event: GestureDetail) {
    this.animation.progressStart(false);
    this.animation.progressStep(this.getStep(event));
  }

  /**
   * 手势结束时
   * @param event
   */
  private onEnd(event: GestureDetail) {
    this.gesture.enable(false);

    const step = this.getStep(event);
    const shouldComplete = step > 0.4;

    this.animation.progressEnd(shouldComplete ? 1 : 0, step);
    this.animation.onFinish(() => {
      shouldComplete ? this.dismiss() : this.gesture.enable(true);
    });
  }

  private getStep(event: GestureDetail) {
    return this.clamp(0, -event.deltaY / 125, 1);
  }

  private clamp(min: number, n: number, max: number) {
    return Math.max(min, Math.min(n, max));
  }

  ngOnDestroy() {
    this.gesture.destroy();
    this.animation.destroy();
  }

  /**
   * 关闭通知
   */
  dismiss(): Observable<void> {
    this.renderer.addClass(this.element, 'hide');

    fromEvent(this.element, 'transitionend').pipe(
      filter((event: TransitionEvent) => event.propertyName === 'visibility'),
      take(1)
    ).subscribe(() => {
      this.overlayRef.dispose();
      this.dismiss$.next();
    });

    return this.onDismiss();
  }

  /**
   * 通知关闭时可观察对象
   */
  onDismiss(): Observable<void> {
    return this.dismiss$.asObservable();
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    fromEvent(this.element, 'transitionend').pipe(
      filter((event: TransitionEvent) => event.propertyName === 'transform'),
      take(1)
    ).subscribe(() => {
      this.dismiss();
      this.handler?.(event);
    });
  }

}
