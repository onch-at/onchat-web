import { Directive, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SafeAny } from '@ngify/types';
import { filter, takeUntil } from 'rxjs/operators';
import { Destroyer } from 'src/app/services/destroyer.service';
import { Overlay } from 'src/app/services/overlay.service';

/**
 * 基础模态框组件类
 * 已实现路由回退时关闭模态框
 */
@Directive()
export abstract class ModalComponent implements OnInit, OnDestroy {
  protected router: Router;
  protected overlay: Overlay;
  protected destroyer: Destroyer;

  ngOnInit(): void {
    // 在当前路由附加#modal，用来实现返回关闭模态框，而不返回上一页
    this.router.navigate([], { fragment: 'modal' });
    this.router.events.pipe(
      takeUntil(this.destroyer),
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => this.dismiss());
  }

  ngOnDestroy(): void {
    this.router.navigate([]);
  }

  dismiss(data?: SafeAny, role?: string, id?: string): void {
    this.overlay.dismissModal(data, role, id);
  }
}