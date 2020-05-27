import { Injectable } from '@angular/core';

/**
 * 反馈服务（音频，震动等）
 */
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  /** 消息提示音：啵 */
  msgAudio: HTMLAudioElement = new Audio('/assets/audio/boo.mp3');

  constructor() { }

  /**
   * 轻微震动：50ms
   */
  vibrate() {
    'vibrate' in window.navigator && window.navigator.vibrate(50);
  }
}
