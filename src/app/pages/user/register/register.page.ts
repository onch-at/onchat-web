import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_PATTERN } from 'src/app/common/constant';
import { ResultCode } from 'src/app/common/enum';
import { Register } from 'src/app/models/form.model';
import { Result, User } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
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
  /** 密码框类型 */
  pwdInputType: string = 'password';
  /** 验证码URL */
  captchaUrl: string = env.captchaUrl;
  usernameMaxLength: number = USERNAME_MAX_LENGTH;
  passwordMaxLength: number = PASSWORD_MAX_LENGTH;

  registerForm: FormGroup = this.fb.group({
    username: [
      '', [
        Validators.pattern(USERNAME_PATTERN),
        Validators.required,
        Validators.minLength(5),
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
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    const username = this.route.snapshot.queryParams.username;
    username && this.registerForm.setValue({ username });
  }

  register() {
    if (this.registerForm.invalid || this.globalDataService.navigationLoading) { return; }

    this.globalDataService.navigationLoading = true;

    const { username, password, captcha } = this.registerForm.value;
    this.onChatService.register(new Register(username, password, captcha)).subscribe((result: Result<User>) => {
      this.overlayService.presentToast(result.msg, result.code === ResultCode.Success ? 1000 : 2000);

      if (result.code !== ResultCode.Success) { // 如果请求不成功，则刷新验证码
        this.globalDataService.navigationLoading = false;
        return this.updateCaptcha();
      }

      this.globalDataService.user = result.data;
      this.socketService.init();

      setTimeout(() => {
        this.router.navigateByUrl('/');
        this.onChatService.init();
      }, 1000);
    });
  }

  /***
   * 更新验证码URL，清空验证码输入框
   */
  updateCaptcha() {
    this.captchaUrl = env.captchaUrl + '?' + Date.now();
    this.registerForm.setValue({ captcha: '' });
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
    const value = StrUtil.trimAll(this.registerForm.get(controlName).value);
    this.registerForm.setValue({ controlName: value });
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