import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH } from 'src/app/common/constant';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  usernameMaxLength: number = USERNAME_MAX_LENGTH;

  userForm: FormGroup = this.fb.group({
    username: [
      null, [
        Validators.pattern(SysUtil.usernamePattern),
        Validators.required,
        Validators.minLength(USERNAME_MIN_LENGTH),
        Validators.maxLength(USERNAME_MAX_LENGTH)
      ]
    ],
    signature: [
      null, [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH)
      ]
    ],
  });

  constructor(
    private fb: FormBuilder,
    public globalDataService: GlobalDataService,
  ) { }

  ngOnInit() {
  }

  /**
   * 消除表单控件的值的空格
   * @param controlName 控件名
   */
  trimAll(controlName: string) {
    this.userForm.controls[controlName].setValue(StrUtil.trimAll(this.userForm.value[controlName]));
  }

}
