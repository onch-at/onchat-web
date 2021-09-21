import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { fade } from 'src/app/animations/ionic.animation';
import { HomeMenuComponent } from 'src/app/components/popovers/home-menu/home-menu.component';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  readonly fade = fade;
  sharp: boolean = false;

  constructor(
    private router: Router,
    private overlay: Overlay,
    public globalData: GlobalData,
  ) { }

  ngOnInit() {
    // 在去到个人中心tab的时候变为直角头部
    this.router.events.pipe(
      takeUntil(this.destroy$),
      filter(event => event instanceof Scroll)
    ).subscribe((event: Scroll) => {
      this.sharp = event.routerEvent.url === '/home/profile';
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  presenHomeMenutPopover(event: Event) {
    this.overlay.popover({
      component: HomeMenuComponent,
      event: event,
      cssClass: 'home-menu-popover'
    });
  }

}
