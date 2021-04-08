import { AfterViewInit, Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { Throttle } from '../common/decorator';

@Directive({
  selector: '[appImageSize]'
})
export class ImageSizeDirective implements AfterViewInit {
  @Input() appImageSize: [number, number];

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    this.resize();
  }

  @HostListener('window:resize')
  @Throttle(100)
  onWindowResize() {
    this.resize();
  }

  private resize() {
    const { nativeElement } = this.elementRef;
    const [width, height] = this.appImageSize;
    const maxWidth = window.innerWidth * 0.4;

    let divisor = 1;

    if (width > maxWidth) {
      divisor = width / maxWidth;
    }

    this.renderer.setStyle(nativeElement, 'height', (height / divisor) + 'px');
  }

}
