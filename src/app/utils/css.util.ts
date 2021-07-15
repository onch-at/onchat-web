import { Renderer2 } from '@angular/core';

export class CssUtil {
  private static sizeMap: Map<string, number> = new Map<string, number>();

  /**
   * rem 转 px
   * @param rem
   */
  static rem2px(rem: number): number {
    return rem * CssUtil.size('1em');
  }

  /**
   * 将一些 CSS size expression 转为 px
   * @param size
   */
  static size(size: string): number {
    if (!CssUtil.sizeMap.has(size)) {
      const div = document.createElement('div');
      div.style.height = size;
      document.body.appendChild(div);
      CssUtil.sizeMap.set(size, div.offsetHeight);
      document.body.removeChild(div);
    }

    return CssUtil.sizeMap.get(size);
  }

  /**
   * 注入CSS样式到目标元素中
   * @param renderer 渲染器
   * @param element 目标元素
   * @param styleSheet CSS样式
   * @param shadowRoot 是否注入到shadowRoot元素
   */
  static injectStyle(renderer: Renderer2, target: HTMLElement, styleSheet: string, shadowRoot: boolean = true): void {
    const element = shadowRoot ? target.shadowRoot : target;
    const styleElement = element.querySelector('style');

    if (styleElement) {
      return styleElement.append(styleSheet);
    }

    const style = renderer.createElement('style');
    style.innerHTML = styleSheet;
    element.appendChild(style);
  }
}