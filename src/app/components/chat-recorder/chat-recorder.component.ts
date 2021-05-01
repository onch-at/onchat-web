import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, filter, first, mergeMap } from 'rxjs/operators';
import { Vector2 } from 'src/app/common/class';
import { ApiService } from 'src/app/services/api.service';
import { FeedbackService } from 'src/app/services/feedback.service';
import { GlobalData } from 'src/app/services/global-data.service';
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
}

@Component({
  selector: 'app-chat-recorder',
  templateUrl: './chat-recorder.component.html',
  styleUrls: ['./chat-recorder.component.scss'],
})
export class ChatRecorderComponent implements OnInit, OnDestroy {
  /** 操作状态 */
  operateState: OperateState = OperateState.None;
  operateStates: typeof OperateState = OperateState;

  /** 录音起始时间 */
  startTime: number = null;
  /** 是否确认录音 */
  comfirmed: boolean = true;
  /** 语音音频对象 */
  audio: HTMLAudioElement;
  /** 语音音频 */
  private voice: Blob;
  /** 一分钟录音计时器 */
  private timer: number;
  /** 发射器 */
  private launcher: BehaviorSubject<boolean>;

  @ViewChild('playBtn', { static: true }) playBtn: ElementRef<HTMLElement>;
  @ViewChild('cancelBtn', { static: true }) cancelBtn: ElementRef<HTMLElement>;

  tips = () => ({
    [OperateState.None]: '按住讲话',
    [OperateState.Send]: '松开发送',
    [OperateState.Play]: '试听录音',
    [OperateState.Cancel]: '取消发送',
  }[this.operateState]);

  constructor(
    private overlay: Overlay,
    private recorder: Recorder,
    private apiService: ApiService,
    private globalData: GlobalData,
    private feedbackService: FeedbackService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.launcher?.complete();
  }

  onStart() {
    this.feedbackService.slightVibrate();
    this.startTime = Date.now();
    this.comfirmed ||= true;
    this.launcher ??= new BehaviorSubject<boolean>(false);

    this.recorder.record().pipe(
      catchError(() => {
        this.startTime = null;
        this.overlay.presentToast('OnChat: 录音权限授权失败！');
        return of(null);
      }),
      filter(o => {
        !this.startTime && this.recorder.stop();
        return o && this.startTime !== null;
      }),
      mergeMap(() => this.recorder.start()),
      first(),
      mergeMap(() => {
        this.clearTimer();
        this.startTime = Date.now(); // 校准录音起始时间
        this.operateState = OperateState.Send;
        this.timer = window.setInterval(() => {
          const time = Date.now() - this.startTime;

          if (time >= 55000) {
            this.overlay.presentToast(`语音还可继续录制${Math.round((60000 - time) / 1000)}秒！`, 1000);
          }

          if (time >= 60000) {
            this.operateState = OperateState.Play;
            this.complete();
            this.feedbackService.slightVibrate();
          }
        }, 1000);

        return this.recorder.available();
      }),
      first(),
    ).subscribe(({ data }: BlobEvent) => {
      // 如果没有确认，或者录不到音
      if (!this.comfirmed || data.size === 0) {
        return this.comfirmed = true;
      }

      this.voice = data;
      this.audio = new Audio(URL.createObjectURL(data));
      // 手动触发数据检查
      this.audio.onended = () => this.changeDetectorRef.detectChanges();
      this.launcher.next(true);
    });
  }

  onMove(clientX: number, clientY: number) {
    const pos = new Vector2(clientX, clientY);
    const playBtn = this.playBtn.nativeElement;
    const cancelBtn = this.cancelBtn.nativeElement;

    switch (true) {
      // 拖动到播放按钮
      case this.isInsideRect(pos, playBtn.getBoundingClientRect()):
        this.comfirmed = true;
        this.operateState !== OperateState.Play && this.feedbackService.slightVibrate();
        this.operateState = OperateState.Play;
        break;

      // 拖动到取消按钮
      case this.isInsideRect(pos, cancelBtn.getBoundingClientRect()):
        this.comfirmed = false;
        this.operateState !== OperateState.Cancel && this.feedbackService.slightVibrate();
        this.operateState = OperateState.Cancel;
        break;

      default:
        this.comfirmed = true;
        this.operateState = OperateState.Send;
    }
  }

  onTouchMove(event: TouchEvent) {
    const { clientX, clientY } = event.changedTouches.item(0);
    this.onMove(clientX, clientY);
  }

  onMouseMove(event: MouseEvent) {
    if (this.startTime) {
      const { clientX, clientY } = event;
      this.onMove(clientX, clientY);
    }
  }

  onCancel() {
    this.operateState = OperateState.None;
    this.audio?.pause();
    this.complete();
  }

  onMouseLeave() {
    if (!this.recorder.state() && this.operateState !== OperateState.Play) {
      this.startTime = null;
      this.operateState = OperateState.None;
    }
  }

  onEnd() {
    if (!this.startTime || !this.recorder.state()) { return; }

    // 录音时间少于0.5秒 或者取消发送
    if (Date.now() - this.startTime < 500 || this.operateState === OperateState.Cancel) {
      this.comfirmed = false;
      this.operateState = OperateState.None;

      return this.complete();
    }

    this.complete();

    if (this.operateState === OperateState.Send) {
      this.send();
    }
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
    this.audio?.pause();
    this.operateState = OperateState.None;

    const { chatroomId } = this.globalData;

    this.launcher.pipe(
      filter(sign => sign),
      first()
    ).subscribe(() => {
      this.launcher.next(false);
      this.overlay.presentToast('TEST SUCCESS！');
      // this.apiService.uploadVoiceToChatroom(chatroomId, this.voice).subscribe((result: Result<VoiceMessage>) => {
      //   console.log(result);

      // });
    });
  }

  /**
   * 某坐标点是否在矩形内
   * @param pos
   * @param rect
   */
  private isInsideRect(pos: Vector2, rect: DOMRect) {
    const { x, y } = pos;

    if (
      x < rect.x ||
      x > rect.x + rect.width ||
      y < rect.y ||
      y > rect.y + rect.height
    ) {
      return false;
    }

    return true;
  }

  /**
   * 结束录音
   */
  private complete() {
    this.recorder.stop();
    this.startTime = null;
    this.clearTimer();
  }

  /**
   * 清理定时器
   */
  private clearTimer() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }

}
