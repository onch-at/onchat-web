import { AfterViewInit, Component, HostListener, Inject, Input } from '@angular/core';
import { Throttle } from 'src/app/common/decorator';
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

  constructor(
    @Inject(WINDOW) private window: Window,
  ) { }

  ngAfterViewInit() {
    this.resize();
  }

  @HostListener('window:resize')
  @Throttle(300)
  onWindowResize() {
    this.resize();
  }

  private resize() {
    let divisor = 1;
    let { width, height } = this.msg.data;
    const maxWidth = this.window.innerWidth * 0.4;

    if (width > maxWidth) {
      divisor = width / maxWidth;
      width /= divisor;
      height /= divisor;
    }

    this.width = width;
    this.height = height;
  }

}
