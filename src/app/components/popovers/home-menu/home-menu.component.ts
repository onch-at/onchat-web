import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SafeAny } from 'src/app/common/interfaces';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss'],
})
export class HomeMenuComponent {

  constructor(
    private router: Router,
  ) { }

  navigate(commands: SafeAny[]) {
    this.router.navigate(commands);
  }

}
