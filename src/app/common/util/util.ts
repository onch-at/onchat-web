export class Util {
    /**
     * 复制节点文本
     * @param element 
     */
    static copyText(element: Element) {
        const range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }
}