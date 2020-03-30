import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { RegisterForm } from 'src/app/models/form.model';
import { Result } from 'src/app/models/result.model';
import { OnChatService } from 'src/app/services/onchat.service';
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
    private onChatService: OnChatService,
    private toastController: ToastController,
    private fb: FormBuilder
  ) {
    
  }

  ngOnInit() {
  }

  register() {
    if (this.registerForm.invalid || this.loading) { return; }
    this.loading = true;
    this.onChatService.register(new RegisterForm(this.registerForm.value.username, this.registerForm.value.password, this.registerForm.value.captcha)).subscribe((result: Result<any>) => {
      if (result.code !== 0) { // 如果请求不成功，则刷新验证码
        this.updateCaptcha();
      }
      this.presentToast(result);
      this.loading = false;
    });
  }

  async presentToast(result: Result<any>) {
    const toast = await this.toastController.create({
      message: ' ' + result.msg,
      duration: result.code === 0 ? 1000 : 2000,
      color: 'dark',
    });
    toast.present();
    if (result.code === 0) {
      toast.onWillDismiss().then(() => { // 在Toast即将关闭前
        this.router.navigate(['/']);
      });
    }
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