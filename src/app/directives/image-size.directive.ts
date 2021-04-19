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
    let divisor = 1;
    let [width, height] = this.appImageSize;
    const { nativeElement } = this.elementRef;
    const maxWidth = window.innerWidth * 0.4;
    const maxHeight = window.innerHeight * 0.5;

    if (width > maxWidth) {
      divisor = width / maxWidth;
      width /= divisor;
      height /= divisor;
    }

    if (height > maxHeight) {
      divisor = height / maxHeight;
      width /= divisor;
      height /= divisor;
    }

    this.renderer.setStyle(nativeElement, 'width', width + 'px');
    this.renderer.setStyle(nativeElement, 'height', height + 'px');
  }

}
