import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { IonVirtualScroll } from '@ionic/angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * Ionic虚拟列表补丁
 *
 * 场景：从包含虚拟列表的页面进入其他页面，窗口尺寸发生变化后，
 * 返回包含虚拟列表的页面，此时虚拟列表的渲染状态错误
 *
 * 原理：监听返回事件后手动更新虚拟列表
 */
@Directive({
  selector: '[appVirtualScrollPatch]'
})
export class VirtualScrollPatchDirective implements OnInit, OnDestroy {
  private subject: Subject<unknown> = new Subject();

  constructor(
    private router: Router,
    private elementRef: ElementRef<IonVirtualScroll>
  ) { }

  ngOnInit() {
    const url = this.router.routerState.snapshot.url;

    this.router.events.pipe(
      takeUntil(this.subject),
      filter(event => event instanceof Scroll && event.routerEvent.url.includes(url))
    ).subscribe(() => {
      this.elementRef.nativeElement?.checkEnd();
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

}
