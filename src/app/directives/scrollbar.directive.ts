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

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {
    const styleSheet = `
      ::-webkit-scrollbar,::-webkit-scrollbar-track {
        width: 7.5px;
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: rgba(var(--oc-color-dark-rgb),.125);
        border: 0;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(var(--oc-color-dark-rgb),.25);
      }
    `;

    SysUtil.injectStyleToShadowRoot(renderer2, elementRef.nativeElement, styleSheet);
  }

}
