import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from 'src/app/common/constant';
import { passwordFeedback } from 'src/app/common/feedback';
import { ValidationFeedback } from 'src/app/common/interface';
import { ChangePassword } from 'src/app/models/form.model';
import { UserService } from 'src/app/services/apis/user.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SyncValidator } from 'src/app/validators/sync.validator';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-password-modifier',
  templateUrl: './password-modifier.component.html',
  styleUrls: ['./password-modifier.component.scss'],
})
export class PasswordModifierComponent extends ModalComponent {
  /** 密码框类型 */
  pwdInputType: string = 'password';
  readonly passwordMaxLength: number = PASSWORD_MAX_LENGTH;
  readonly passwordFeedback: ValidationFeedback = passwordFeedback;

  form: FormGroup = this.formBuilder.group({
    oldPassword: [
      '', [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]
    ],
    newPassword: [
      '', [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]
    ],
    confirmNewPassword: [
      '', [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]
    ],
  }, {
    validators: SyncValidator.equal('newPassword', 'confirmNewPassword')
  });

  loading: boolean = false;

  constructor(
    public globalData: GlobalData,
    private socketService: SocketService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    protected overlay: Overlay,
    protected router: Router,
  ) {
    super();
  }

  submit() {
    if (this.form.invalid || this.loading) { return; }

    this.loading = true;

    const { oldPassword, newPassword } = this.form.value;

    this.userService.changePassword(new ChangePassword(oldPassword, newPassword)).pipe(
      finalize(() => this.loading = false)
    ).subscribe(() => {
      this.overlay.presentToast('成功修改密码，请重新登录！', 1000);

      this.router.navigateByUrl('/user/login');
      this.globalData.reset();
      this.socketService.disconnect();
      this.dismiss();
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
