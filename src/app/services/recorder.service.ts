import { Injectable } from '@angular/core';
import { from, fromEvent, of, Subject } from 'rxjs';
import { filter, mergeMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Recorder {
  private recorder: MediaRecorder = null;
  /** 开始录音主题 */
  readonly action: Subject<void> = new Subject();
  /** 录音完成主题 */
  readonly available: Subject<BlobEvent> = new Subject();

  constructor() {
    // 在页面隐藏的时候，关闭媒体流
    fromEvent(document, 'visibilitychange').pipe(
      filter(() => document.hidden)
    ).subscribe(() => this.close());
  }

  /**
   * 关闭音频流并销毁记录器
   */
  close() {
    if (this.recorder) {
      this.recorder.stream.getAudioTracks().forEach(o => o.stop());
      this.recorder = null;
    }
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
    fromEvent(this.recorder, 'start').pipe(take(1)).subscribe(() => {
      this.action.next();
    });

    fromEvent(this.recorder, 'dataavailable').pipe(take(1)).subscribe((event: BlobEvent) => {
      this.available.next(event);
    });

    this.recorder.start();

    return this.action;
  }

  /**
   * 结束录音
   */
  stop() {
    this.recorder?.state !== 'inactive' && this.recorder?.stop();
  }

}
