import { AfterViewInit, Component, ElementRef, HostListener, Input, Renderer2, ViewChild } from '@angular/core';
import { ImageMessage } from 'src/app/models/msg.model';
import { Message } from 'src/app/models/onchat.model';

@Component({
  selector: 'app-image-message',
  templateUrl: './image-message.component.html',
  styleUrls: ['./image-message.component.scss'],
})
export class ImageMessageComponent implements AfterViewInit {
  @Input() msg: Message<ImageMessage>;
  @ViewChild('img', { static: true }) img: ElementRef<HTMLImageElement>;

  private timer: number;

  constructor(
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
    this.resize();
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.timer && clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.resize(), 100);
  }

  private resize() {
    let divisor = 1;
    let { width, height } = this.msg.data;
    const { nativeElement } = this.img;
    const maxWidth = window.innerWidth * 0.4;
    const maxHeight = window.innerHeight * 0.5;

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

    this.renderer.setStyle(nativeElement, 'width', width + 'px');
    this.renderer.setStyle(nativeElement, 'height', height + 'px');
  }

}
