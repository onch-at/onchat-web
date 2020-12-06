import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_PATTERN } from 'src/app/common/constant';
import { SessionStorageKey } from 'src/app/common/enum';
import { Register } from 'src/app/models/form.model';
import { Result, User } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { environment as env } from '../../../../environments/environment';
import { passwordFeedback, usernameFeedback } from '../login/login.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  /** 是否正在加载中 */
  loading: boolean = false;
  /** 密码框类型 */
  pwdInputType: string = 'password';
  /** 验证码URL */
  captchaUrl: string = env.captchaUrl;
  usernameMaxLength: number = USERNAME_MAX_LENGTH;
  passwordMaxLength: number = PASSWORD_MAX_LENGTH;

  registerForm: FormGroup = this.fb.group({
    username: [
      null, [
        Validators.pattern(USERNAME_PATTERN),
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(USERNAME_MAX_LENGTH)
      ]
    ],
    password: [
      null, [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]
    ],
    confirmPassword: [
      null, [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]
    ],
    captcha: [
      null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ]
    ],
  }, { validators: equalValidator });

  usernameFeedback: (errors: ValidationErrors) => string = usernameFeedback;
  passwordFeedback: (errors: ValidationErrors) => string = passwordFeedback;
  captchaFeedback: (errors: ValidationErrors) => string = (errors: ValidationErrors): string => {
    if (errors.required) {
      return '验证码不能为空！';
    } else if (errors.minlength || errors.maxlength) {
      return '验证码长度必须为4位字符！';
    }
  };

  constructor(
    public globalDataService: GlobalDataService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private onChatService: OnChatService,
    private overlayService: OverlayService,
    private sessionStorageService: SessionStorageService,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    const username = this.route.snapshot.queryParams.username;
    username && this.registerForm.controls.username.setValue(username);
  }

  register() {
    if (this.registerForm.invalid || this.loading) { return; }
    this.loading = true;
    this.onChatService.register(
      new Register(this.registerForm.value.username, this.registerForm.value.password, this.registerForm.value.captcha)
    ).subscribe(async (result: Result<User>) => {
      if (result.code !== 0) { // 如果请求不成功，则刷新验证码
        this.updateCaptcha();
      }

      const toast = this.overlayService.presentToast(result.msg, result.code === 0 ? 1000 : 2000);
      if (result.code === 0) {
        this.globalDataService.user = result.data;
        this.sessionStorageService.setItemToMap(
          SessionStorageKey.UserMap,
          result.data.id,
          result.data
        );
        this.onChatService.init();
        this.socketService.init();

        (await toast).onWillDismiss().then(() => { // 在Toast即将关闭前
          this.router.navigate(['/']);
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });
  }

  /***
   * 更新验证码URL，清空验证码输入框
   */
  updateCaptcha() {
    this.captchaUrl = env.captchaUrl + '?' + Date.now();
    this.registerForm.controls.captcha.setValue('');
  }

  /**
   * 切换密码输入框的TYPE值
   */
  togglePwdInputType() {
    this.pwdInputType = this.pwdInputType == 'text' ? 'password' : 'text';
  }

  /**
   * 消除表单控件的值的空格
   * @param controlName 控件名
   */
  trimAll(controlName: string) {
    this.registerForm.controls[controlName].setValue(StrUtil.trimAll(this.registerForm.value[controlName]));
  }

}

/**
 * 验证器：用于验证密码与确认密码的值是否相等
 * @param control
 */
export const equalValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password.value !== confirmPassword.value ? { 'equal': true } : null;
};