import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { slide } from 'src/app/animations/ionic.animation';
import { SafeAny } from 'src/app/common/interfaces';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  readonly slide = slide;
  pathname: string;

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.pathname = this.router.routerState.snapshot.url;
  }

  segmentChange(event: SafeAny) {
    this.pathname = event.detail.value;
    this.router.navigateByUrl(this.pathname, { skipLocationChange: true });
  }

}
