import { AfterViewInit, Component, HostListener, Inject, Input } from '@angular/core';
import { Debounce } from '@ngify/at';
import { WINDOW } from 'src/app/common/tokens';
import { ImageMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';
import { CssUtils } from 'src/app/utilities/css.utils';

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
  @Debounce(100)
  onWindowResize() {
    this.resize();
  }

  private resize() {
    let divisor = 1;
    let { width, height } = this.msg.data;
    const maxWidth = this.window.innerWidth * 0.4;
    const maxHeight = this.window.innerHeight * 0.5;
    const minSize = CssUtils.size('3rem');

    // 处理图片尺寸过大的情况
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

    // 处理图片尺寸过小的情况
    if (width < minSize) {
      divisor = width / minSize;
      width /= divisor;
      height /= divisor;
    }

    if (height < minSize) {
      divisor = height / minSize;
      width /= divisor;
      height /= divisor;
    }

    this.width = width;
    this.height = height;
  }

}
