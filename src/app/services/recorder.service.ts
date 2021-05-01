import { Injectable } from '@angular/core';
import { from, fromEvent, of } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Recorder {
  private recorder: MediaRecorder = null;

  constructor() {
    // 在页面隐藏的时候，关闭媒体流
    fromEvent(document, 'visibilitychange').pipe(
      filter(() => document.hidden && this.recorder !== null)
    ).subscribe(() => {
      this.recorder.stream.getAudioTracks().forEach(o => o.stop());
      this.recorder = null;
    });
  }

  /**
   * 申请权限并准备录音
   */
  record() {
    if (this.recorder) {
      this.stop();
      return of(this.recorder);
    }

    return from(navigator.mediaDevices.getUserMedia({ audio: true })).pipe(
      mergeMap(stream => of(this.recorder = new MediaRecorder(stream)))
    );
  }

  /**
   * 录音机状态
   */
  state() {
    return this.recorder?.state;
  }

  /**
   * 开始录音
   */
  start() {
    const event = fromEvent(this.recorder, 'start');
    this.recorder.start();
    return event;
  }

  /**
   * 结束录音
   */
  stop() {
    this.recorder?.state !== 'inactive' && this.recorder?.stop();
  }

  available() {
    return fromEvent<BlobEvent>(this.recorder, 'dataavailable');
  }
}
