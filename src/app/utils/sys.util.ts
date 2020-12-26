import { Renderer2 } from '@angular/core';

export class SysUtil {

    /**
     * 复制节点文本
     * @param element
     */
    static copyText(element: HTMLElement): void {
        const selection = window.getSelection();
        selection.removeAllRanges();
        element.style.userSelect = 'text';
        const range = document.createRange();
        range.selectNodeContents(element);

        selection.addRange(range);
        document.execCommand('copy');
        element.style.userSelect = null;
        selection.removeAllRanges();
    }

    /**
     * 暴力注入CSS样式到目标元素的ShadowRoot中
     * @param renderer 渲染器
     * @param element 目标元素
     * @param styleSheet CSS样式
     */
    static injectStyleToShadowRoot(renderer: Renderer2, element: HTMLElement, styleSheet: string): void {
        const styleElement = element.shadowRoot.querySelector('style');

        if (styleElement) {
            return styleElement.append(styleSheet);
        }

        const style = renderer.createElement('style');
        style.innerHTML = styleSheet;
        element.shadowRoot.appendChild(style);
    }

    /**
     * 将base64/URLEncoded数据转化为Blob
     * @param dataURI
     */
    static dataURItoBlob(dataURI: string): Blob {
        // 将base64/URLEncoded数据转换为字符串中保存的原始二进制数据
        const byteArr = dataURI.split(',');
        const byteStr = byteArr[0].indexOf('base64') >= 0 ? atob(byteArr[1]) : unescape(byteArr[1]);

        // 将字符串的字节写入Uint8Array
        const ia = new Uint8Array(byteStr.length);
        for (let i = 0; i < byteStr.length; i++) {
            ia[i] = byteStr.charCodeAt(i);
        }

        return new Blob([ia], {
            type: byteArr[0].split(':')[1].split(';')[0]
        });
    }

    /**
     * 选择文件
     * @param accept 文件类型MINE
     */
    static uploadFile(accept: string = null) {
        const input = document.createElement('input')
        input.setAttribute('type', 'file');
        input.setAttribute('style', 'visibility:hidden');
        accept && input.setAttribute('accept', accept);
        document.body.appendChild(input);
        input.click();

        return new Promise((resolve, reject) => {
            input.onchange = (event: Event) => {
                resolve(event);
                document.body.removeChild(input);
            };

            const rejector = (event: Event) => reject(event);
            input.onerror = rejector;
            input.oncancel = rejector;
        });
    }

    /**
     * 通过URL下载文件
     * @param url
     */
    static downLoadFile(url: string) {
        const anchor = document.createElement('a') as HTMLAnchorElement;
        anchor.href = url;
        anchor.download = url.split('?')[0].split('/').pop();
        anchor.click();
    }

    /**
     * 是否支持WebP格式
     */
    static isSupportWEBP(): boolean {
        try {
            return document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch (e) {
            return false;
        }
    }

    /**
     * 是否支持JPEG格式
     */
    static isSupportJPEG(): boolean {
        try {
            return document.createElement('canvas').toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0;
        } catch (e) {
            return false;
        }
    }

    static throttle(fn: Function, wait: number) {
        let timer = null;
        return () => {
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, arguments);
            }, wait);
        }
    }

    static debounce(fn: Function, wait: number) {
        let timer = null;
        return () => {
            timer === null && (timer = setTimeout(() => {
                fn.apply(this, arguments);
                timer = null;
            }, wait));
        }
    }

    // /**
    //  * 压缩图片并返回base64
    //  * @param imgSrc 图片URL/URI
    //  * @param width 图片宽度
    //  * @param height 图片高度
    //  * @param quality 压缩质量（0~1）
    //  * @param type 压缩的图片格式
    //  */
    // static compressImage(imgSrc: string, width: number, height: number, quality: number = 0.8, type: string = 'webp'): Promise<string> {
    //     const img = new Image();
    //     img.setAttribute('crossOrigin', 'Anonymous');

    //     const canvas = document.createElement('canvas');
    //     canvas.width = width;
    //     canvas.height = height;

    //     const ctx = canvas.getContext('2d');

    //     return new Promise((resolve, reject) => {
    //         img.onload = () => {
    //             ctx.drawImage(img, 0, 0, width, height);
    //             resolve(canvas.toDataURL('image/' + type, quality));
    //         };

    //         img.onerror = (error: Event) => reject(error);

    //         img.src = imgSrc;
    //     });
    // }

}