import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { merge, Subject } from 'rxjs';
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
  private destroy$: Subject<void> = new Subject<void>();

  @Input() msg: Message<VoiceMessage>;

  audio: HTMLAudioElement;

  constructor(
    private recorder: Recorder,
    private routerOutlet: IonRouterOutlet,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    merge(
      this.recorder.action,
      this.routerOutlet.activateEvents
    ).pipe(takeUntil(this.destroy$)).subscribe(() => this.pause());
  }

  ngOnDestroy() {
    this.pause();
    this.destroy$.next();
    this.destroy$.complete();
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
