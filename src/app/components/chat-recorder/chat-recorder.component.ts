import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnDestroy, Output, ViewChild } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, mergeMap, take, tap } from 'rxjs/operators';
import { Vector2 } from 'src/app/common/classes';
import { SafeAny } from 'src/app/common/interfaces';
import { WINDOW } from 'src/app/common/tokens';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Overlay } from 'src/app/services/overlay.service';
import { Recorder } from 'src/app/services/recorder.service';

enum OperateState {
  /** 无操作 */
  None,
  /** 发送语音 */
  Send,
  /** 播放录音 */
  Play,
  /** 取消发送 */
  Cancel
};

export interface ChatRecorderOutputEvent {
  /** 语音文件 */
  blob: Blob;
  /** 语音音频的 URL */
  src: string;
  /** 语音音频的持续时间 */
  duration: number;
}

/**
 * 某坐标点是否在矩形内
 * @param pos
 * @param rect
 */
const isInsideRect = ({ x, y }: Vector2, rect: DOMRect) => (
  x >= rect.x &&
  x <= rect.x + rect.width &&
  y >= rect.y &&
  y <= rect.y + rect.height
);

@Component({
  selector: 'app-chat-recorder',
  templateUrl: './chat-recorder.component.html',
  styleUrls: ['./chat-recorder.component.scss'],
})
export class ChatRecorderComponent implements OnDestroy {
  /** 语音时长 */
  private duration: number;
  /** 一分钟录音计时器 */
  private timer: number;
  /** 发射器 */
  private launcher: BehaviorSubject<ChatRecorderOutputEvent>;

  /** 操作状态 */
  operateState: OperateState = OperateState.None;
  readonly operateStates: typeof OperateState = OperateState;
  /** 录音起始时间 */
  startTime: number = null;
  /** 语音音频对象 */
  audio: HTMLAudioElement;

  @ViewChild('playBtn', { static: true }) playBtn: ElementRef<HTMLElement>;
  @ViewChild('cancelBtn', { static: true }) cancelBtn: ElementRef<HTMLElement>;

  /** 开始录音 */
  @Output() appStart: EventEmitter<void> = new EventEmitter();
  /** 录音完成 */
  @Output() appOutput: EventEmitter<ChatRecorderOutputEvent> = new EventEmitter();

  get tips(): string {
    return {
      [OperateState.None]: '按住讲话',
      [OperateState.Send]: '松开发送',
      [OperateState.Play]: '试听录音',
      [OperateState.Cancel]: '取消发送',
    }[this.operateState];
  }

  constructor(
    private overlay: Overlay,
    private recorder: Recorder,
    private feedbackService: FeedbackService,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(WINDOW) private window: Window,
  ) { }

  ngOnDestroy() {
    this.launcher?.complete();
    this.recorder.close();
  }

  onStart() {
    this.feedbackService.slightVibrate();
    this.launcher ??= new BehaviorSubject(null);
    this.launcher.value && this.launcher.next(null);
    this.startTime = Date.now();

    this.recorder.record().pipe(
      catchError((error: SafeAny) => {
        this.startTime = null;
        return throwError(() => error);
      }),
      tap(() => this.appStart.emit()),
      mergeMap(() => this.recorder.start()),
      take(1),
      tap(() => this.startTime || this.recorder.cancel()), // 如果录音中途被中断，即startTime被置空，则取消录音
      filter(() => this.startTime !== null),
      tap(() => {
        this.startTime = Date.now(); // 校准录音起始时间
        this.operateState = OperateState.Send;
        this.clearTimer();
        this.timer = this.window.setInterval(() => {
          const time = Date.now() - this.startTime;

          if (time >= 55000) {
            this.overlay.toast(`语音还可继续录制${Math.round((60000 - time) / 1000)}秒！`, 1000);
          }

          if (time >= 60000) {
            this.complete();
            this.operateState = OperateState.Play;
            this.feedbackService.slightVibrate();
            this.clearTimer();
          }
        }, 1000);
      }),
      mergeMap(() => this.recorder.available),
      take(1),
      filter(({ data }: BlobEvent) => data.size > 0)
    ).subscribe(({ data }: BlobEvent) => {
      this.audio = new Audio(URL.createObjectURL(data));
      // 手动触发数据检查
      this.audio.onended = () => this.changeDetectorRef.detectChanges();
      this.launcher.next({
        blob: data,
        src: this.audio.src,
        duration: this.duration
      });
    });
  }

  onMove(clientX: number, clientY: number) {
    const pos = new Vector2(clientX, clientY);
    const playBtn = this.playBtn.nativeElement;
    const cancelBtn = this.cancelBtn.nativeElement;

    switch (true) {
      // 拖动到播放按钮
      case isInsideRect(pos, playBtn.getBoundingClientRect()):
        if (this.operateState !== OperateState.Play) {
          this.feedbackService.slightVibrate();
          this.operateState = OperateState.Play;
        }
        break;

      // 拖动到取消按钮
      case isInsideRect(pos, cancelBtn.getBoundingClientRect()):
        if (this.operateState !== OperateState.Cancel) {
          this.feedbackService.slightVibrate();
          this.operateState = OperateState.Cancel;
        }
        break;

      // 其他情况全部视为发送
      default:
        if (this.operateState !== OperateState.Send) {
          this.operateState = OperateState.Send;
        }
    }
  }

  onTouchMove({ changedTouches }: TouchEvent) {
    const { clientX, clientY } = changedTouches.item(0);
    this.onMove(clientX, clientY);
  }

  onMouseMove(event: MouseEvent) {
    if (this.startTime) {
      const { clientX, clientY } = event;
      this.onMove(clientX, clientY);
    }
  }

  onCancel() {
    this.audio?.pause();
    this.cancel();
  }

  onMouseLeave() {
    if (!this.recorder.state() && this.operateState !== OperateState.Play) {
      this.startTime = null;
      this.operateState = OperateState.None;
    }
  }

  onEnd() {
    // 如果是试听录音
    if (this.operateState === OperateState.Play && !this.startTime) {
      return;
    }

    // 如果录音被中断，录音时间少于0.5秒，或者取消发送
    if (
      !this.recorder.state() ||
      Date.now() - this.startTime < 500 ||
      this.operateState === OperateState.Cancel
    ) {
      return this.cancel();
    }

    this.complete();

    this.operateState === OperateState.Send && this.send();
  }

  /**
   * 播放/暂停
   */
  play() {
    if (this.audio) {
      this.audio.paused ? this.audio.play() : this.audio.pause();
    }
  }

  /** 发送语音 */
  send() {
    this.operateState === OperateState.Play && this.audio.pause();

    this.operateState = OperateState.None;

    this.launcher.pipe(
      filter(o => o !== null),
      take(1)
    ).subscribe((value: ChatRecorderOutputEvent) => {
      this.launcher.next(null);
      this.appOutput.emit(value);
    });
  }

  /**
   * 取消录音
   */
  private cancel() {
    this.recorder.cancel();
    this.operateState = OperateState.None;
    this.startTime &&= null;
    this.clearTimer();
  }

  /**
   * 结束录音
   */
  private complete() {
    this.recorder.complete();
    const duration = (Date.now() - this.startTime) / 1000;
    this.duration = duration >= 1 ? duration | 0 : +duration.toFixed(1);
    this.startTime = null;
    this.clearTimer();
  }

  /**
   * 清理定时器
   */
  private clearTimer() {
    this.timer && this.window.clearInterval(this.timer);
    this.timer = null;
  }

}
