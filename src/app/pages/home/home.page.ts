import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HomeMenuComponent } from 'src/app/components/popovers/home-menu/home-menu.component';
import { GlobalDataService } from 'src/app/services/global-data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  sharp: boolean = false;

  subject: Subject<unknown> = new Subject();

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    public globalDataService: GlobalDataService,
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

  async presentPopover(event: any) {
    const popover = await this.popoverController.create({
      component: HomeMenuComponent,
      event: event,
      cssClass: 'home-menu-popover'
    });
    return await popover.present();
  }

}
