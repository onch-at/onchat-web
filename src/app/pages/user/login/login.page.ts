import { Component, OnInit } from '@angular/core';

import { OnChatService } from '../../../services/onchat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private onChatService: OnChatService, private router: Router) { }

  ngOnInit() {
    this.onChatService.getUsernameByUid(10).subscribe((o: any) => {
      console.log(o)
    })

    this.onChatService.login('10','1').subscribe((o: any) => {
      console.log(o)
    })

    // this.router.navigate(['/home']);
  }

}
