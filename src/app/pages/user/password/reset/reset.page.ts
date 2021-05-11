import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonRouterOutlet, ViewWillEnter, ViewWillLeave } from '@ionic/angular';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_PATTERN } from 'src/app/common/constant';
import { ResultCode } from 'src/app/common/enum';
import { captchaFeedback, passwordFeedback, usernameFeedback } from 'src/app/common/feedback';
import { ValidationFeedback } from 'src/app/common/interface';
import { ResetPassword } from 'src/app/models/form.model';
import { Result } from 'src/app/models/onchat.model';
import { ApiService } from 'src/app/services/api.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SyncValidator } from 'src/app/validators/sync.validator';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements ViewWillLeave, ViewWillEnter {
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
    confirmPassword: [
      '', [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]
    ],
    captcha: [
      '', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]
    ],
  }, {
    validators: SyncValidator.equal('password', 'confirmPassword')
  });

  /** 密码框类型 */
  pwdInputType: string = 'password';
  readonly usernameMaxLength: number = USERNAME_MAX_LENGTH;
  readonly passwordMaxLength: number = PASSWORD_MAX_LENGTH;
  usernameFeedback: ValidationFeedback = usernameFeedback;
  passwordFeedback: ValidationFeedback = passwordFeedback;
  captchaFeedback: ValidationFeedback = captchaFeedback;
  /** 60秒倒计时 */
  countdown: number = 60;
  /** 倒计时计时器 */
  countdownTimer: number;

  constructor(
    public globalData: GlobalData,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private overlay: Overlay,
    private router: Router,
    private routerOutlet: IonRouterOutlet
  ) { }

  ionViewWillEnter() {
    this.routerOutlet.swipeGesture = false;
  }

  ionViewWillLeave() {
    this.routerOutlet.swipeGesture = true;
  }

  sendCaptcha() {
    if (this.countdownTimer) { return; }

    this.apiService.sendEmailCaptchaByUsername(this.form.value.username).subscribe((result: Result<boolean>) => {
      this.overlay.presentToast(result.code === ResultCode.Success ? '验证码发送至邮箱！' : '验证码发送失败！');
    });

    this.countdownTimer = window.setInterval(() => {
      if (--this.countdown <= 0) {
        window.clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.countdown = 60;
      }
    }, 1000);
  }

  submit() {
    if (this.form.invalid || this.globalData.navigating) { return; }

    const { username, password, captcha } = this.form.value;

    this.apiService.resetPassword(new ResetPassword(username, password, captcha)).subscribe((result: Result) => {
      const { code, msg } = result;

      if (code !== ResultCode.Success) {
        this.globalData.navigating = false;
        return this.overlay.presentToast('操作失败，原因：' + msg, 2000);
      }

      this.overlay.presentToast('密码重置成功，请重新登录！');

      setTimeout(() => {
        this.router.navigateByUrl('/user/login');
      }, 1000);
    });
  }

  /**
   * 消除表单控件的值的空格
   * @param controlName 控件名
   */
  trimAll(controlName: string) {
    const value = StrUtil.trimAll(this.form.get(controlName).value);
    this.form.controls[controlName].setValue(value);
  }

  /**
   * 切换密码输入框的TYPE值
   */
  togglePwdInputType() {
    this.pwdInputType = this.pwdInputType === 'text' ? 'password' : 'text';
  }

}
