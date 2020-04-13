import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Str } from 'src/app/common/util/str';
import { LoginForm } from 'src/app/models/form.model';
import { Result } from 'src/app/models/result.model';
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
    this.onChatService.login(new LoginForm(this.loginForm.value.username, this.loginForm.value.password)).subscribe((result: Result<any>) => {
      this.presentToast(result);
    })
  }

  async presentToast(result: Result<any>) {
    const toast = await this.toastController.create({
      message: ' ' + result.msg,
      duration: result.code === 0 ? 1000 : 2000,
      color: 'dark'
    });
    toast.present();
    if (result.code === 0) {
      this.onChatService.isLogin = true;
      this.socketService.init();
      toast.onWillDismiss().then(() => { // 在Toast即将关闭前
        this.router.navigate(['/']);
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      header: 'Toast header',
      message: 'Click to Close',
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
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
    this.loginForm.controls[controlName].setValue(Str.trimAll(this.loginForm.value[controlName]));
  }

}
