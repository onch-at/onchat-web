import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CssUtil } from '../../utils/css.util';

/**
 * 在桌面模式下，隐藏宿主元素的滚动条
 * 由于滚动条样式尚未有标准定义，IONIC官方拒绝暴露滚动条样式
 * 所以只能暴力注入样式来修改样式了
 * https://github.com/ionic-team/ionic-framework/issues/17685
 */
@Directive({
  selector: '[appScrollbar]'
})
export class ScrollbarDirective implements AfterViewInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private platform: Platform
  ) { }

  ngAfterViewInit() {
    if (this.platform.is('desktop')) {
      const styleSheet = '::-webkit-scrollbar { display:none; }';

      CssUtil.injectStyle(this.renderer, this.elementRef.nativeElement, styleSheet);
    }
  }

}
