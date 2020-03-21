import { Component, OnInit } from '@angular/core';
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
  /** 用户名 */
  username: string = '';
  /** 用户密码 */
  password: string = '';
  /** 密码框类型 */
  pwdInputType: string = 'password';

  constructor(private onChatService: OnChatService, private router: Router, public toastController: ToastController) { }

  ngOnInit() {
    // this.onChatService.getUsernameByUid(10).subscribe((o: any) => {
    //   console.log(o)
    // })

    this.onChatService.login(new LoginForm(this.username, this.password)).subscribe((o: Result<any>) => {
      console.log(o)
    })

    // this.router.navigate(['/home']);
  }

  login() {
    this.onChatService.login(new LoginForm(this.username, this.password)).subscribe((o: Result<any>) => {
      console.log(o)
      this.presentToast(o.msg)
    })
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
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
