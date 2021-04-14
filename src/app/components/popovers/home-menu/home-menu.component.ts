import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-home-menu',
  templateUrl: './home-menu.component.html',
  styleUrls: ['./home-menu.component.scss'],
})
export class HomeMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private overlay: Overlay,
  ) { }

  ngOnInit() {

  }

  navigate(commands: any[]) {
    this.router.navigate(commands);
  }

  dismiss() {
    this.overlay.dismissPopover();
  }

}
