import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { StrUtil } from 'src/app/common/utils/str.util';
import { Login } from 'src/app/models/form.model';
import { Result } from 'src/app/models/onchat.model';
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
    private router: Router,
    private toastController: ToastController,
    private fb: FormBuilder,
    private socketService: SocketService,
  ) { }

  ngOnInit() { }

  login() {
    if (this.loginForm.invalid || this.loading) { return; }
    this.loading = true;
    this.onChatService.login(new Login(this.loginForm.value.username, this.loginForm.value.password)).subscribe((result: Result<number>) => {
      this.presentToast(result);
    })
  }

  async presentToast(result: Result<number>) {
    const toast = await this.toastController.create({
      message: ' ' + result.msg,
      duration: result.code === 0 ? 1000 : 2000,
      color: 'dark'
    });
    toast.present();
    if (result.code === 0) {
      this.onChatService.isLogin = true;
      this.onChatService.userId = result.data;
      this.socketService.init();
      toast.onWillDismiss().then(() => { // 在Toast即将关闭前
        return this.router.navigate(['/']);
      }).then(() => {
        this.onChatService.init();
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
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
