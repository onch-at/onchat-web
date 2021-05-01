import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Vector2 } from 'src/app/common/class';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SysUtil } from 'src/app/utils/sys.util';

enum OperatingState {
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
export class ChatRecorderComponent implements OnInit {
  /** 录音机 */
  private recorder: MediaRecorder;
  /** 操作状态 */
  operatingState: OperatingState = OperatingState.None;
  operatingStates: typeof OperatingState = OperatingState;

  /** 录音起始时间 */
  startTime: number;
  /** 是否确认录音 */
  comfirmed: boolean = true;
  /** 语音音频 */
  voice: Blob;
  /** 语音音频对象 */
  audio: HTMLAudioElement;

  timer: number;

  @ViewChild('playBtn', { static: true }) playBtn: ElementRef<HTMLElement>;
  @ViewChild('cancelBtn', { static: true }) cancelBtn: ElementRef<HTMLElement>;

  tips = () => ({
    [OperatingState.None]: '按住讲话',
    [OperatingState.Send]: '松开发送',
    [OperatingState.Play]: '播放录音',
    [OperatingState.Cancel]: '取消发送',
  }[this.operatingState]);

  constructor(
    private overlay: Overlay,
    private feedbackService: FeedbackService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  onStart() {
    this.feedbackService.slightVibrate();
    this.startTime = Date.now();
    this.start();
  }

  onMove(clientX: number, clientY: number) {
    const pos = new Vector2(clientX, clientY);
    const playBtn = this.playBtn.nativeElement;
    const cancelBtn = this.cancelBtn.nativeElement;

    switch (true) {
      // 拖动到播放按钮
      case this.isInsideRect(pos, playBtn.getBoundingClientRect()):
        this.comfirmed = true;
        this.operatingState = OperatingState.Play;
        this.feedbackService.slightVibrate();
        break;

      // 拖动到取消按钮
      case this.isInsideRect(pos, cancelBtn.getBoundingClientRect()):
        this.comfirmed = false;
        this.operatingState = OperatingState.Cancel;
        this.feedbackService.slightVibrate();
        break;

      default:
        this.comfirmed = true;
        this.operatingState = OperatingState.Send;
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
    this.operatingState = OperatingState.None;
    this.complete();
  }

  onEnd() {
    if (!this.startTime) { return; }

    // 录音时间少于0.5秒 或者取消发送
    if (Date.now() - this.startTime < 500 || this.operatingState === OperatingState.Cancel) {
      this.comfirmed = false;
      this.operatingState = OperatingState.None;
      return this.complete();
    }

    switch (this.operatingState) {
      case OperatingState.Send:
        this.send();
        break;

      case OperatingState.Play:
        console.log('Play');
        break;
    }

    this.complete();
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
    this.operatingState = OperatingState.None;
    console.log('Send');
    this.overlay.presentToast('test');
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
   * 请求权限，开始录音
   */
  private async start() {
    if (!this.recorder) {
      try {
        this.recorder = await SysUtil.record().toPromise();
        this.recorder.addEventListener('dataavailable', ({ data }: BlobEvent) => {
          if (!this.comfirmed || data.size === 0) {
            return this.comfirmed = true;
          }
          this.voice = data;
          this.audio = new Audio(URL.createObjectURL(data));
          // 手动触发数据检查
          this.audio.onended = () => this.changeDetectorRef.detectChanges();
          console.log(data);
        });
      } catch (error) {
        this.overlay.presentToast('OnChat: 录音权限授权失败！');
      }
    }

    // 如果录音机准备好了，且已经开始计时
    if (this.recorder && this.startTime) {
      this.recorder.start();
      // this.timer
      this.operatingState = OperatingState.Send;
    }
  }

  /**
   * 完成录音
   */
  private complete() {
    this.recorder?.state !== 'inactive' && this.recorder?.stop();
    this.startTime = null;
  }

}
