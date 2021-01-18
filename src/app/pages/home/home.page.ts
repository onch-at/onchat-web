import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HomeMenuComponent } from 'src/app/components/popovers/home-menu/home-menu.component';
import { GlobalData } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  sharp: boolean = false;

  private subject: Subject<unknown> = new Subject();

  constructor(
    private router: Router,
    private overlayService: OverlayService,
    public globalData: GlobalData,
  ) { }

  ngOnInit() {
    // 在去到个人中心tab的时候变为直角头部
    this.router.events.pipe(
      filter(event => event instanceof Scroll),
      takeUntil(this.subject)
    ).subscribe((event: Scroll) => {
      this.sharp = event.routerEvent.url === '/home/profile';
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  presenHomeMenutPopover(event: Event) {
    this.overlayService.presentPopover({
      component: HomeMenuComponent,
      event: event,
      cssClass: 'home-menu-popover'
    });
  }

}
