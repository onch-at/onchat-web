import { AfterViewInit, Component, HostListener, Inject, Input } from '@angular/core';
import { WINDOW } from 'src/app/common/token';
import { ImageMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';

@Component({
  selector: 'app-image-message',
  templateUrl: './image-message.component.html',
  styleUrls: ['./image-message.component.scss'],
})
export class ImageMessageComponent implements AfterViewInit {
  @Input() msg: Message<ImageMessage>;
  width: number;
  height: number;

  private timer: number;

  constructor(
    @Inject(WINDOW) private window: Window,
  ) { }

  ngAfterViewInit() {
    this.resize();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.timer && clearTimeout(this.timer);
    this.timer = this.window.setTimeout(() => this.resize(), 100);
  }

  private resize() {
    let divisor = 1;
    let { width, height } = this.msg.data;
    const maxWidth = this.window.innerWidth * 0.4;
    const maxHeight = this.window.innerHeight * 0.5;

    if (width > maxWidth) {
      divisor = width / maxWidth;
      width /= divisor;
      height /= divisor;
    }

    if (height > maxHeight) {
      divisor = height / maxHeight;
      width /= divisor;
      height /= divisor;
    }

    this.width = width;
    this.height = height;
  }

}
