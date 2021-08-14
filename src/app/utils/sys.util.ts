import { Observable } from 'rxjs';

export class SysUtil {

  /**
   * 选择文件
   * @param accept 文件类型MINE
   * @param multiple 多文件上传
   */
  static selectFile(accept: string = null, multiple: boolean = false) {
    const input = document.createElement('input') as HTMLInputElement;
    input.style.display = 'none';
    input.type = 'file';
    input.multiple = multiple;
    input.accept = accept;

    document.body.appendChild(input);

    input.click();

    return new Observable(observer => {
      const complete = () => {
        document.body.removeChild(input);
        observer.complete();
      };

      input.onchange = (event: Event) => {
        observer.next(event);
        complete();
      };

      input.onerror = (event: Event) => {
        observer.error(event);
        complete();
      };
    });
  }

  /**
   * 通过URL下载文件
   * @param url
   */
  static downLoadFile(url: string) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = new URL(url).pathname.split('/').pop();
    anchor.click();
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