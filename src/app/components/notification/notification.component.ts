import { OverlayRef } from '@angular/cdk/overlay';
import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  @Input() title: string = 'title';
  @Input() description: string = 'description';
  @Input() overlayRef: OverlayRef;
  @Input() overlayDuration: number;
  hostElement: HTMLElement;
  unlistener: () => void;

  constructor(
    private element: ElementRef,
    private renderer2: Renderer2
  ) { }

  ngOnInit() {
    this.hostElement = this.element.nativeElement.querySelector('.notification');

    setTimeout(() => {
      this.renderer2.addClass(this.hostElement, 'hide');
      this.unlistener = this.renderer2.listen(this.hostElement, 'transitionend', () => {
        this.overlayRef.dispose();
      });
    }, 3000);
  }

  ngOnDestroy() {
    this.unlistener && this.unlistener();
  }

}
