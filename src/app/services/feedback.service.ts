import { Injectable } from '@angular/core';

/**
 * 反馈服务（音频，震动等）
 */
@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  msgAudio: HTMLAudioElement = new Audio('/assets/audio/boo.mp3');

  constructor() { }

  vibrate() {
    'vibrate' in window.navigator && window.navigator.vibrate(50);
  }
}
