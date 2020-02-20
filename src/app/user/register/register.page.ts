import { Component, OnInit } from '@angular/core';

import { environment as env } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  /** 验证码URL */
  captchaUrl: string = env.captchaUrl;

  constructor() { }

  ngOnInit() {
  }

  /***
   * 更新验证码URL
   */
  updateCaptchaUrl() {
    this.captchaUrl = env.captchaUrl + '?' + Date.now();
  }

}
