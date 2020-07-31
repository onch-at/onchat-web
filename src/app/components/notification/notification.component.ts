import { OverlayRef } from '@angular/cdk/overlay';
import { Component, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  /** 标题 */
  @Input() title: string;
  /** 描述 */
  @Input() description: string;
  /** 图标URL */
  @Input() iconUrl: string;
  /** 浮层 */
  @Input() overlayRef: OverlayRef;
  /** 浮层持续时间 */
  @Input() overlayDuration: number;
  /** 点击事件处理函数 */
  @Input() tapHandler: (e: Event) => void;
  /** 当前Notification的元素 */
  element: HTMLElement;
  /** 取消监听事件函数 */
  unlistener: () => void;

  dismiss$: Subject<void> = new Subject();

  constructor(
    private elementRef: ElementRef,
    private renderer2: Renderer2
  ) { }

  ngOnInit() {
    this.element = this.elementRef.nativeElement.querySelector('.notification');
  }

  ngOnDestroy() {
    this.unlistener && this.unlistener();
  }

  dismiss(): Promise<null> {
    this.renderer2.addClass(this.element, 'hide');
    this.unlistener && this.unlistener();
    return new Promise((resolve: (value?: any) => void) => {
      this.unlistener = this.renderer2.listen(this.element, 'transitionend', () => {
        this.overlayRef.dispose();
        this.unlistener();
        this.unlistener = null;
        this.dismiss$.next();
        resolve();
      });
    });
  }

  onDismiss(): Observable<void> {
    return this.dismiss$.asObservable();
  }

  @HostListener('tap', ['$event'])
  onTap(event: Event) {
    this.unlistener && this.unlistener();
    this.unlistener = this.renderer2.listen(this.element, 'transitionend', () => {
      this.dismiss();
      this.tapHandler(event);
    });
  }

}
