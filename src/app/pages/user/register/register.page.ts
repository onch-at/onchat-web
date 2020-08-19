import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StrUtil } from 'src/app/common/utils/str.util';
import { Register } from 'src/app/models/form.model';
import { Result, User } from 'src/app/models/onchat.model';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment as env } from '../../../../environments/environment';

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

  registerForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ]
    ],
    confirmPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ]
    ],
    captcha: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)
      ]
    ],
  }, { validators: equalValidator });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private onChatService: OnChatService,
    private overlayService: OverlayService,
    private sessionStorageService: SessionStorageService,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
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

      const toast = this.overlayService.presentMsgToast(result.msg, result.code === 0 ? 1000 : 2000);
      if (result.code === 0) {
        this.onChatService.user = result.data;
        this.sessionStorageService.setUser(result.data);
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
    if (this.pwdInputType == 'password') {
      this.pwdInputType = 'text';
    } else {
      this.pwdInputType = 'password';
    }
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