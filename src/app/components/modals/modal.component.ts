import { Directive, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { OverlayService } from "src/app/services/overlay.service";

/**
 * 基础模态框组件类
 * 已实现路由回退时关闭模态框
 */
@Directive()
export abstract class ModalComponent implements OnInit, OnDestroy {
  protected subject: Subject<unknown> = new Subject();

  constructor(
    protected router: Router,
    protected overlayService: OverlayService,
  ) { }

  ngOnInit(): void {
    // 在当前路由附加#modal，用来实现返回关闭模态框，而不返回上一页
    this.router.navigate([], { fragment: 'modal' });
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.subject)
    ).subscribe(() => this.dismiss());
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  dismiss(data?: any, role?: string, id?: string): any {
    this.overlayService.dismissModal(data, role, id);
  }
}