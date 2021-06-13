import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { base64ToFile } from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { SysUtil } from '../utils/sys.util';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private _format: string;

  /** 最佳图片格式，优先级：webp -> jpeg -> png */
  get format() {
    if (this._format) {
      return this._format;
    }

    return this._format = this.isSupportWEBP ? 'webp' : this.isSupportJPEG ? 'jpeg' : 'png';
  }
  /**
   * 是否支持WebP格式
   */
  get isSupportWEBP(): boolean {
    try {
      return document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp');
    } catch (e) {
      return false;
    }
  }

  /**
   * 是否支持JPEG格式
   */
  get isSupportJPEG(): boolean {
    try {
      return document.createElement('canvas').toDataURL('image/jpeg').startsWith('data:image/jpeg');
    } catch (e) {
      return false;
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  /**
   * 压缩图片
   * @param src 图片URL
   * @param quality 质量
   */
  compress(src: string, quality: number = 0.8) {
    const format = this.format;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Observable<Blob>((observer) => {
      img.onload = () => {
        this.resize(img);

        // 如果支持WebWorker
        if ('OffscreenCanvas' in window) {
          return this.drawInWebWorker(img, quality, format).subscribe(blob => {
            observer.next(blob);
            observer.complete();
          });
        }

        observer.next(base64ToFile(this.draw(img, quality, format)));
        observer.complete();
      }

      img.onerror = (error: any) => {
        observer.error(error);
        observer.complete();
      }

      img.src = src;
    });
  }

  /**
   * 调整图像尺寸
   * @param img
   */
  private resize(img: HTMLImageElement) {
    const maxWidth = 1280;
    const maxHeight = 720;

    if (img.width > maxWidth) {
      const divisor = img.width / maxWidth;
      img.width /= divisor;
      img.height /= divisor;
    }

    if (img.height > maxHeight) {
      const divisor = img.height / maxHeight;
      img.width /= divisor;
      img.height /= divisor;
    }
  }

  /**
   * 在主线程中绘制
   * @param img 图像
   * @param quality 质量
   * @param format 格式
   */
  draw(img: HTMLImageElement, quality: number, format: string) {
    const canvas = this.document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    return canvas.toDataURL('image/' + format, quality);
  }

  /**
   * 在WebWorker线程中绘制
   * @param img 图像
   * @param quality 质量
   * @param format 格式
   */
  drawInWebWorker(img: HTMLImageElement, quality: number, format: string) {
    const worker = new Worker('../workers/image-compressor.worker', { type: 'module' });

    return new Observable<Blob>(observer => {
      const complete = () => {
        worker.terminate();
        observer.complete();
      };

      SysUtil.createImageBitmap(img).subscribe(imageBitmap => {
        worker.onmessage = ({ data }) => {
          observer.next(data);
          complete();
        }

        worker.onerror = error => {
          observer.error(error);
          complete();
        }

        worker.postMessage({ quality, format, imageBitmap }, [imageBitmap]);
      }, error => {
        observer.error(error);
        complete();
      });
    });
  }

  /**
   * 是否为动图
   * @param image
   */
  isAnimation(image: Blob): boolean {
    return ['image/apng', 'image/gif'].includes(image.type);
  }

}
