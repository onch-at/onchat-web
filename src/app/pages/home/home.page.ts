import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { fade } from 'src/app/animations/ionic.animation';
import { HomeMenuComponent } from 'src/app/components/popovers/home-menu/home-menu.component';
import { Destroyer } from 'src/app/services/destroyer.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [Destroyer]
})
export class HomePage implements OnInit {
  readonly fade = fade;
  sharp: boolean = false;

  constructor(
    public globalData: GlobalData,
    private router: Router,
    private overlay: Overlay,
    private destroyer: Destroyer,
  ) { }

  ngOnInit() {
    // 在去到个人中心tab的时候变为直角头部
    this.router.events.pipe(
      takeUntil(this.destroyer),
      filter(event => event instanceof Scroll)
    ).subscribe((event: Scroll) => {
      this.sharp = event.routerEvent.url === '/home/profile';
    });
  }

  presenHomeMenutPopover(event: Event) {
    this.overlay.popover({
      component: HomeMenuComponent,
      event: event,
      cssClass: 'home-menu-popover',
      dismissOnSelect: true
    });
  }

}
