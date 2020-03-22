import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { LoginForm } from 'src/app/models/form.model';
import { Result } from 'src/app/models/result.model';
import { OnChatService } from '../../../services/onchat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
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

  constructor(private onChatService: OnChatService, private router: Router, private toastController: ToastController, private fb: FormBuilder) { }

  ngOnInit() {
    // this.onChatService.getUsernameByUid(10).subscribe((o: any) => {
    //   console.log(o)
    // })
    console.log(this.loginForm.value.username)

    this.onChatService.login(new LoginForm(this.loginForm.value.username, this.loginForm.value.password)).subscribe((o: Result<any>) => {
      console.log(o)
    })

    // this.router.navigate(['/home']);
  }

  login() {
    if (this.loginForm.invalid) { return; }
    this.onChatService.login(new LoginForm(this.loginForm.value.username, this.loginForm.value.password)).subscribe((o: Result<any>) => {
      this.presentToast(o.msg)
    })
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 200000000,
      color: 'dark',
    });
    toast.present();
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

}
