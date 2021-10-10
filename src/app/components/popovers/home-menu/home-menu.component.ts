import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SafeAny } from 'src/app/common/interfaces';
import { Overlay } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss'],
})
export class HomeMenuComponent {

  constructor(
    private router: Router,
    private overlay: Overlay,
  ) { }

  navigate(commands: SafeAny[]) {
    this.router.navigate(commands);
  }

  dismiss() {
    this.overlay.dismissPopover();
  }

}
