import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_PATTERN } from 'src/app/common/constant';
import { ResultCode } from 'src/app/common/enum';
import { passwordFeedback, usernameFeedback } from 'src/app/common/feedback';
import { ValidationFeedback } from 'src/app/common/interface';
import { Login } from 'src/app/models/form.model';
import { Result, User } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { OnChatService } from '../../../services/onchat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewWillLeave, ViewWillEnter {
  /** 密码框类型 */
  pwdInputType: string = 'password';
  readonly usernameMaxLength: number = USERNAME_MAX_LENGTH;
  readonly passwordMaxLength: number = PASSWORD_MAX_LENGTH;

  form: FormGroup = this.formBuilder.group({
    username: [
      '', [
        Validators.required,
        Validators.pattern(USERNAME_PATTERN),
        Validators.minLength(USERNAME_MIN_LENGTH),
        Validators.maxLength(USERNAME_MAX_LENGTH)
      ]
    ],
    password: [
      '', [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]
    ],
  });

  usernameFeedback: ValidationFeedback = usernameFeedback;
  passwordFeedback: ValidationFeedback = passwordFeedback;

  constructor(
    public globalData: GlobalData,
    private router: Router,
    private onChatService: OnChatService,
    private apiService: ApiService,
    private overlay: Overlay,
    private socketService: SocketService,
    private formBuilder: FormBuilder,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() { }

  ionViewWillEnter() {
    this.routerOutlet.swipeGesture = false;
  }

  ionViewWillLeave() {
    this.routerOutlet.swipeGesture = true;
  }

  login() {
    if (this.form.invalid || this.globalData.navigating) { return; }

    this.globalData.navigating = true;

    const { username, password } = this.form.value;

    this.apiService.login(new Login(username, password)).subscribe((result: Result<User>) => {
      const { code, data, msg } = result;

      if (code !== ResultCode.Success) {
        this.globalData.navigating = false;
        return this.overlay.presentToast('登录失败，原因：' + msg, 2000);
      }

      this.overlay.presentToast('登录成功！即将跳转…');

      this.globalData.user = data;
      this.socketService.init();

      setTimeout(() => {
        this.router.navigateByUrl('/');
        this.onChatService.init();
      }, 1000);
    })
  }

  /**
   * 切换密码输入框的TYPE值
   */
  togglePwdInputType() {
    this.pwdInputType = this.pwdInputType === 'text' ? 'password' : 'text';
  }

  /**
   * 消除表单控件的值的空格
   * @param controlName 控件名
   */
  trimAll(controlName: string) {
    const value = StrUtil.trimAll(this.form.get(controlName).value);
    this.form.controls[controlName].setValue(value);
  }

}
