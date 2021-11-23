import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {
  private readonly requestFieldName: 'webkitRequestFullScreen' | 'msRequestFullscreen' | 'mozRequestFullScreen' | 'requestFullscreen';
  private readonly exitFieldName: 'webkitExitFullscreen' | 'msExitFullscreen' | 'mozCancelFullScreen' | 'exitFullscreen';
  private readonly elementFieldName: 'webkitFullscreenElement' | 'msFullscreenElement' | 'mozFullScreenElement' | 'fullscreenElement';
  private readonly changeFieldName: 'onwebkitfullscreenchange' | 'MSFullscreenChange' | 'onmozfullscreenchange' | 'onfullscreenchange';

  constructor(@Inject(DOCUMENT) private document: Document) {
    if ('webkitRequestFullScreen' in this.document.documentElement) {
      this.requestFieldName = 'webkitRequestFullScreen';
      this.exitFieldName = 'webkitExitFullscreen';
      this.elementFieldName = 'webkitFullscreenElement';
      this.changeFieldName = 'onwebkitfullscreenchange';
    } else if ('msRequestFullscreen' in this.document.documentElement) {
      this.requestFieldName = 'msRequestFullscreen';
      this.exitFieldName = 'msExitFullscreen';
      this.elementFieldName = 'msFullscreenElement';
      this.changeFieldName = 'MSFullscreenChange';
    } else if ('mozRequestFullScreen' in this.document.documentElement) {
      this.requestFieldName = 'mozRequestFullScreen';
      this.exitFieldName = 'mozCancelFullScreen';
      this.elementFieldName = 'mozFullScreenElement';
      this.changeFieldName = 'onmozfullscreenchange';
    } else {
      this.requestFieldName = 'requestFullscreen';
      this.exitFieldName = 'exitFullscreen';
      this.elementFieldName = 'fullscreenElement';
      this.changeFieldName = 'onfullscreenchange';
    }
  }

  /**
   * 请求全屏
   * @param target
   * @param options
   */
  request(target: HTMLElement = this.document.documentElement, options?: FullscreenOptions): Promise<void> {
    return target[this.requestFieldName](options);
  }

  /**
   * 退出全屏
   */
  exit(): Promise<void> {
    return this.document[this.exitFieldName]();
  }

  /**
   * 切换全屏
   * @param target
   * @param options
   */
  toggle(target: HTMLElement = this.document.documentElement, options?: FullscreenOptions): Promise<void> {
    if (this.isFullscreen(target)) {
      return this.exit();
    }

    return this.request(target, options);
  }

  /**
   * 元素是否为全屏
   * @param target
   */
  isFullscreen(target: HTMLElement): boolean {
    return target === this.document[this.elementFieldName];
  }

  /**
   * 切换全屏事件
   * @param target
   */
  change(target: HTMLElement): Observable<Event> {
    return fromEvent(target, this.changeFieldName);
  }
}
