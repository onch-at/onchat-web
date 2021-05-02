import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { VoiceMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';

@Component({
  selector: 'app-voice-message',
  templateUrl: './voice-message.component.html',
  styleUrls: ['./voice-message.component.scss'],
})
export class VoiceMessageComponent implements OnInit {
  @Input() msg: Message<VoiceMessage>;
  audio: HTMLAudioElement;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() { }

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
