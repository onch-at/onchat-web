import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OnChatService } from '../../../services/onchat.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pwdInputType: string = 'password';

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

  /**
   * 切换密码输入框的TYPE值
   */
  togglePwdInputType() {
    if (this.pwdInputType == 'password') {
      this.pwdInputType = 'text';
    } else {
      this.pwdInputType = 'password';
    }
  }

}
