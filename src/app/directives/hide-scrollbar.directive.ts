import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SysUtil } from '../utils/sys.util';

/**
 * 在桌面模式下，隐藏宿主元素的滚动条
 * 由于滚动条样式尚未有标准定义，IONIC官方拒绝暴露滚动条样式
 * 所以只能暴力注入样式来修改样式了
 * https://github.com/ionic-team/ionic-framework/issues/17685
 */
@Directive({
  selector: '[appHideScrollbar]'
})
export class HideScrollbarDirective implements AfterViewInit {

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private platform: Platform
  ) { }

  ngAfterViewInit() {
    if (this.platform.is('desktop')) {
      const styleSheet = '::-webkit-scrollbar { display:none; }';

      SysUtil.injectStyleToShadowRoot(this.renderer, this.elementRef.nativeElement, styleSheet);
    }
  }

}
