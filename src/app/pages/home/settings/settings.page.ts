import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  rangeChange(e) {
    document.documentElement.style.fontSize = e.detail.value + '%'
  }

}
