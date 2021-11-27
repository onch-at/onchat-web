import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CssUtils } from '../../utilities/css.utils';

/**
 * 在桌面模式下，隐藏宿主元素的滚动条
 * 由于滚动条样式尚未有标准定义，IONIC官方拒绝暴露滚动条样式
 * 所以只能通过注入样式来修改样式了
 * https://github.com/ionic-team/ionic-framework/issues/17685
 */
@Directive({
  selector: '[appScrollbar], ion-content',
  providers: [CssUtils]
})
export class ScrollbarDirective implements AfterViewInit {

  constructor(
    private elementRef: ElementRef,
    private cssUtils: CssUtils,
    private platform: Platform
  ) { }

  ngAfterViewInit() {
    if (this.platform.is('desktop')) {
      const styleSheet = '::-webkit-scrollbar { display:none; }';

      this.cssUtils.injectStyle(this.elementRef.nativeElement, styleSheet);
    }
  }

}
