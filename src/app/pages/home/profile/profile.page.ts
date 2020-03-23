import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private onChatService: OnChatService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  logout() {
    this.onChatService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
