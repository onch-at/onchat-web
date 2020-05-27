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
}