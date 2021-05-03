import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { VoiceMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';
import { Recorder } from 'src/app/services/recorder.service';

@Component({
  selector: 'app-voice-message',
  templateUrl: './voice-message.component.html',
  styleUrls: ['./voice-message.component.scss'],
})
export class VoiceMessageComponent implements OnInit, OnDestroy {
  private subject: Subject<unknown> = new Subject();

  @Input() msg: Message<VoiceMessage>;

  audio: HTMLAudioElement;

  constructor(
    private recorder: Recorder,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.recorder.action.pipe(takeUntil(this.subject)).subscribe(() => this.pause());
  }

  ngOnDestroy() {
    this.pause();
    this.subject.next();
    this.subject.complete();
  }

  play() {
    if (!this.audio) {
      this.audio = new Audio(this.msg.data.url);
      // 手动触发数据检查
      this.audio.onended = () => this.changeDetectorRef.detectChanges();
    }

    if (this.audio.paused) {
      this.audio.currentTime = 0;
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  pause() {
    this.audio?.pause();
  }

}
