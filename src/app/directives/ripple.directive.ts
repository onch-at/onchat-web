import { Directive, ElementRef, Renderer2 } from '@angular/core';

/** 为宿主元素添加涟漪效果 */
@Directive({
  selector: '[appRipple]'
})
export class RippleDirective {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    const { nativeElement } = this.elementRef;
    const ripple = this.renderer.createElement('ion-ripple-effect');
    const position = window.getComputedStyle(nativeElement).getPropertyValue('position');

    position === 'static' && this.renderer.setStyle(nativeElement, 'position', 'relative');
    this.renderer.setStyle(nativeElement, 'overflow', 'hidden');
    this.renderer.setStyle(nativeElement, 'cursor', 'pointer');

    this.renderer.addClass(nativeElement, 'ion-activatable');

    this.renderer.appendChild(nativeElement, ripple);
  }

}
