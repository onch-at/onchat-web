import { OverlayRef } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  @Input() title: string;
  @Input() description: string;
  @Input() iconUrl: string;
  @Input() overlayRef: OverlayRef;
  @Input() overlayDuration: number;
  element: HTMLElement;
  unlistener: () => void;

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
    return new Promise((resolve: (value?: any) => void) => {
      this.unlistener = this.renderer2.listen(this.element, 'transitionend', () => {
        this.overlayRef.dispose();
        this.unlistener();
        this.unlistener = null;
        resolve();
      });
    });
  }

}
