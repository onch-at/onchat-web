import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_PATTERN } from 'src/app/common/constant';
import { ResultCode } from 'src/app/common/enum';
import { ValidationFeedback } from 'src/app/common/interface';
import { Register } from 'src/app/models/form.model';
import { Result, User } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { AsyncValidator } from 'src/app/validators/async.validator';
import { SyncValidator } from 'src/app/validators/sync.validator';
import { passwordFeedback, usernameFeedback } from '../login/login.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  /** 密码框类型 */
  pwdInputType: string = 'password';
  usernameMaxLength: number = USERNAME_MAX_LENGTH;
  passwordMaxLength: number = PASSWORD_MAX_LENGTH;
  emailMaxLength: number = EMAIL_MAX_LENGTH;

  countdown: number = 60;
  countdownTimer: number;

  registerForm: FormGroup = this.fb.group({
    username: [
      '', [
        Validators.pattern(USERNAME_PATTERN),
        Validators.required,
        Validators.minLength(USERNAME_MIN_LENGTH),
        Validators.maxLength(USERNAME_MAX_LENGTH)
      ]
    ],
    email: [
      '', [
        Validators.required,
        Validators.maxLength(EMAIL_MAX_LENGTH),
        Validators.email
      ], [
        this.asyncValidator.legalEmail()
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

  usernameFeedback: ValidationFeedback = usernameFeedback;
  passwordFeedback: ValidationFeedback = passwordFeedback;
  emailFeedback: ValidationFeedback = (errors: ValidationErrors) => {
    if (!errors) { return; }
    if (errors.maxlength) {
      return `电子邮箱长度不能大于${EMAIL_MAX_LENGTH}位字符！`;
    } else if (errors.email) {
      return '非法的电子邮箱格式！';
    } else if (errors.legalmail) {
      return '该电子邮箱已被占用！';
    }
  };
  captchaFeedback: ValidationFeedback = (errors: ValidationErrors) => {
    if (!errors) { return; }
    if (errors.required) {
      return '验证码不能为空！';
    } else if (errors.minlength || errors.maxlength) {
      return '验证码长度必须为6位字符！';
    }
  };

  constructor(
    public globalData: GlobalData,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private asyncValidator: AsyncValidator,
    private onChatService: OnChatService,
    private overlayService: OverlayService,
    private socketService: SocketService,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.routerOutlet.swipeGesture = false;

    const username = this.route.snapshot.queryParams.username;
    username && this.registerForm.controls.username.setValue(username);
  }

  ngOnDestroy() {
    this.routerOutlet.swipeGesture = true;
  }

  register() {
    if (this.registerForm.invalid || this.globalData.navigating) { return; }

    this.globalData.navigating = true;

    const { username, password, email, captcha } = this.registerForm.value;
    this.onChatService.register(new Register(username, password, email, captcha)).subscribe((result: Result<User>) => {
      this.overlayService.presentToast(result.msg, result.code === ResultCode.Success ? 1000 : 2000);

      if (result.code !== ResultCode.Success) {
        this.globalData.navigating = false;
        return;
      }

      this.globalData.user = result.data;
      this.socketService.init();

      setTimeout(() => {
        this.router.navigateByUrl('/');
        this.onChatService.init();
      }, 1000);
    });
  }

  sendCaptcha() {
    const ctrl = this.registerForm.get('email');
    if (ctrl.errors || this.countdownTimer) { return; }

    this.onChatService.sendEmailCaptcha(ctrl.value).subscribe((result: Result<boolean>) => {
      this.overlayService.presentToast(result.code === ResultCode.Success ? '验证码发送至你的邮箱！' : '验证码发送失败！');
    });

    this.countdownTimer = window.setInterval(() => {
      if (--this.countdown <= 0) {
        window.clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.countdown = 60;
      }
    }, 1000);
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
    const value = StrUtil.trimAll(this.registerForm.get(controlName).value);
    this.registerForm.controls[controlName].setValue(value);
  }

}
