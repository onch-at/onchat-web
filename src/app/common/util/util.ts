import { Renderer2 } from '@angular/core';

export class Util {
    /**
     * 复制节点文本
     * @param element 
     */
    static copyText(element: Element): void {
        const range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }

    /**
     * 判断浏览器内核是否为苹果
     */
    static isAppleWebKit(): boolean {
        return /iphone|ipad|ipod/i.test(navigator.userAgent);
    }

    /**
     * 暴力注入CSS样式到目标元素的ShadowRoot中
     * @param renderer 渲染器
     * @param element 目标元素
     * @param styleSheet CSS样式
     */
    static injectStyleToShadowRoot(renderer: Renderer2, element: HTMLElement, styleSheet: string): void {
        const style = renderer.createElement('style');
        style.innerHTML = styleSheet;
        element.shadowRoot.appendChild(style);
    }
}