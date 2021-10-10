import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { EMAIL_MAX_LENGTH } from 'src/app/common/constants';
import { captchaFeedback, emailFeedback } from 'src/app/common/feedback';
import { ValidationFeedback } from 'src/app/common/interfaces';
import { WINDOW } from 'src/app/common/tokens';
import { Result } from 'src/app/models/onchat.model';
import { IndexService } from 'src/app/services/apis/index.service';
import { UserService } from 'src/app/services/apis/user.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { StrUtil } from 'src/app/utils/str.util';
import { AsyncValidator } from 'src/app/validators/async.validator';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-email-binder',
  templateUrl: './email-binder.component.html',
  styleUrls: ['./email-binder.component.scss'],
})
export class EmailBinderComponent extends ModalComponent {
  form: FormGroup = this.formBuilder.group({
    email: [
      '', [
        Validators.required,
        Validators.maxLength(EMAIL_MAX_LENGTH),
        Validators.email
      ], [
        this.asyncValidator.legalEmail()
      ]
    ],
    captcha: [
      '', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6)
      ]
    ]
  });
  readonly emailMaxLength: number = EMAIL_MAX_LENGTH;
  readonly emailFeedback: ValidationFeedback = emailFeedback;
  readonly captchaFeedback: ValidationFeedback = captchaFeedback;

  loading: boolean = false;
  /** 60秒倒计时 */
  countdown: number = 60;
  /** 倒计时计时器 */
  countdownTimer: number;

  constructor(
    public globalData: GlobalData,
    private formBuilder: FormBuilder,
    private asyncValidator: AsyncValidator,
    private systemService: IndexService,
    private userService: UserService,
    protected overlay: Overlay,
    protected router: Router,
    @Inject(WINDOW) private window: Window,
  ) {
    super();
  }

  sendCaptcha() {
    const ctrl = this.form.get('email');
    if (ctrl.errors || this.countdownTimer) { return; }

    this.systemService.sendEmailCaptcha(ctrl.value).subscribe(() => {
      this.overlay.toast('验证码发送至邮箱！');
    });

    this.countdownTimer = this.window.setInterval(() => {
      if (--this.countdown <= 0) {
        this.window.clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        this.countdown = 60;
      }
    }, 1000);
  }

  submit() {
    if (!this.form.valid || this.loading) { return; }

    this.loading = true;

    const { email, captcha } = this.form.value;
    this.userService.bindEmail(email, captcha).pipe(
      finalize(() => this.loading = false)
    ).subscribe(({ data }: Result<string>) => {
      this.overlay.toast('成功绑定电子邮箱！', 1000);

      this.globalData.user.email = data;
      this.dismiss();
    }, () => {
      this.form.get('captcha').setValue('');
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

  dismiss() {
    this.globalData.user.email && super.dismiss();
  }

}
