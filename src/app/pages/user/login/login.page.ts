import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StrUtil } from 'src/app/common/utils/str.util';
import { Login } from 'src/app/models/form.model';
import { Result, User } from 'src/app/models/onchat.model';
import { OverlayService } from 'src/app/services/overlay.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { SocketService } from 'src/app/services/socket.service';
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

  loginForm = this.fb.group({
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
  });

  constructor(
    private onChatService: OnChatService,
    private overlayService: OverlayService,
    private sessionStorageService: SessionStorageService,
    private socketService: SocketService,
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() { }

  login() {
    if (this.loginForm.invalid || this.loading) { return; }
    this.loading = true;
    this.onChatService.login(
      new Login(this.loginForm.value.username, this.loginForm.value.password)
    ).subscribe(async (result: Result<User>) => {
      const toast = this.overlayService.presentMsgToast(result.msg, result.code === 0 ? 1000 : 2000);

      if (result.code === 0) {
        this.onChatService.user = result.data;
        this.sessionStorageService.setUser(result.data);
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
    this.loginForm.controls[controlName].setValue(StrUtil.trimAll(this.loginForm.value[controlName]));
  }

}
