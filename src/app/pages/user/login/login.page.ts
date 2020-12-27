import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_PATTERN } from 'src/app/common/constant';
import { ResultCode } from 'src/app/common/enum';
import { Login } from 'src/app/models/form.model';
import { Result, User } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { OnChatService } from '../../../services/onchat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  /** 是否正在加载中 */
  loading: boolean = false;
  /** 密码框类型 */
  pwdInputType: string = 'password';
  usernameMaxLength: number = USERNAME_MAX_LENGTH;
  passwordMaxLength: number = PASSWORD_MAX_LENGTH;

  loginForm: FormGroup = this.fb.group({
    username: [
      null, [
        Validators.pattern(USERNAME_PATTERN),
        Validators.required,
        Validators.minLength(USERNAME_MIN_LENGTH),
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
  });

  usernameFeedback: (errors: ValidationErrors) => string = usernameFeedback;
  passwordFeedback: (errors: ValidationErrors) => string = passwordFeedback;

  constructor(
    private onChatService: OnChatService,
    public globalDataService: GlobalDataService,
    private overlayService: OverlayService,
    private socketService: SocketService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() { }

  login() {
    if (this.loginForm.invalid || this.loading) { return; }

    this.loading = true;

    const { username, password } = this.loginForm.value;

    this.onChatService.login(new Login(username, password)).subscribe(async (result: Result<User>) => {
      const toast = this.overlayService.presentToast(result.msg, result.code === ResultCode.Success ? 1000 : 2000);

      if (result.code === ResultCode.Success) {
        this.globalDataService.user = result.data;
        this.socketService.init();

        (await toast).onWillDismiss().then(() => { // 在Toast即将关闭前
          return this.router.navigate(['/']);
        }).then(() => {
          this.onChatService.init();
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    })
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
    this.loginForm.controls[controlName].setValue(StrUtil.trimAll(this.loginForm.value[controlName]));
  }

}

export function usernameFeedback(errors: ValidationErrors): string {
  if (errors.required) {
    return '用户名不能为空！';
  } else if (errors.pattern) {
    return '用户名只能包含字母/汉字/数字/下划线/横杠！';
  } else if (errors.minlength || errors.maxlength) {
    return `用户名长度必须在${USERNAME_MIN_LENGTH}~${USERNAME_MAX_LENGTH}位字符之间！`;
  }
};

export function passwordFeedback(errors: ValidationErrors): string {
  if (errors.required) {
    return '密码不能为空！';
  } else if (errors.minlength || errors.maxlength) {
    return `密码长度必须在${PASSWORD_MIN_LENGTH}~${PASSWORD_MAX_LENGTH}位字符之间！`;
  }
};
