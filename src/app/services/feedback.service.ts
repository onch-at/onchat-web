import { Injectable } from '@angular/core';

/**
 * 反馈服务（音频，震动等）
 */
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  /** 提示音：啵 */
  booAudio: HTMLAudioElement = new Audio('/assets/audio/boo.mp3');
  /** 提示音：叮噔 */
  dingDengAudio: HTMLAudioElement = new Audio('/assets/audio/ding-deng.mp3');

  constructor() { }

  /**
   * 轻微震动：50ms
   */
  vibrate() {
    'vibrate' in window.navigator && window.navigator.vibrate(25);
  }
}
