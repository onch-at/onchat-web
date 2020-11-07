import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { SysUtil } from '../utils/sys.util';

/**
 * 由于IONIC官方拒绝暴露滚动条样式
 * 所以只能暴力注入样式来修改样式了
 * https://github.com/ionic-team/ionic-framework/issues/17685
 */
@Directive({
  selector: '[appScrollbar]'
})
export class ScrollbarDirective {

  constructor(elementRef: ElementRef, renderer2: Renderer2) {
    const styleSheet = `
      ::-webkit-scrollbar {
        display:none;
      }
    `;

    SysUtil.injectStyleToShadowRoot(renderer2, elementRef.nativeElement, styleSheet);
  }

}
