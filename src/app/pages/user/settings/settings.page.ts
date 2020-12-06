import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, SIGNATURE_MAX_LENGTH, SIGNATURE_MIN_LENGTH, USERNAME_MAX_LENGTH } from 'src/app/common/constant';
import { Gender, Mood } from 'src/app/common/enum';
import { AvatarCropperComponent } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  nicknameMaxLength: number = USERNAME_MAX_LENGTH;
  signatureMaxLength: number = SIGNATURE_MAX_LENGTH;
  gender: typeof Gender = Gender;

  monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  today: string = new Date().toISOString();

  userInfoForm: FormGroup = this.fb.group({
    nickname: [
      null, [
        Validators.required,
        Validators.minLength(NICKNAME_MIN_LENGTH),
        Validators.maxLength(NICKNAME_MAX_LENGTH)
      ]
    ],
    signature: [
      null, [
        Validators.minLength(SIGNATURE_MIN_LENGTH),
        Validators.maxLength(SIGNATURE_MAX_LENGTH)
      ]
    ],
    mood: [
      null, [
        Validators.required
      ]
    ],
    birthday: [
      null, [
        Validators.required
      ]
    ],
    gender: [
      null, [
        Validators.required
      ]
    ],
  });

  constructor(
    private fb: FormBuilder,
    public globalDataService: GlobalDataService,
    private overlayService: OverlayService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    const { user } = this.globalDataService;
    const { controls } = this.userInfoForm;

    controls.nickname.setValue(user.nickname);
    controls.signature.setValue(user.signature);
    controls.mood.setValue(user.mood || Mood.Joy);
    controls.birthday.setValue(user.birthday || this.today);
    controls.gender.setValue(user.gender || Gender.Secret);
  }

  /**
   * 消除表单控件的值的空格
   * @param controlName 控件名
   */
  trimAll(controlName: string) {
    this.userInfoForm.controls[controlName].setValue(StrUtil.trimAll(this.userInfoForm.value[controlName]));
  }

  nicknameFeedback(errors: ValidationErrors): string {
    if (errors.required) {
      return '昵称不能为空！';
    } else if (errors.minlength || errors.maxlength) {
      return `昵称长度必须在${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}位字符之间！`;
    }
  }

  signatureFeedback(errors: ValidationErrors): string {
    if (errors.minlength || errors.maxlength) {
      return `个性签名长度必须在${SIGNATURE_MIN_LENGTH}~${SIGNATURE_MAX_LENGTH}位字符之间！`;
    }
  }

  presentActionSheet() {
    const buttons = [
      {
        text: '更换头像',
        handler: () => SysUtil.uploadFile('image/*').then((event: Event) => this.modalController.create({
          component: AvatarCropperComponent,
          componentProps: {
            imageChangedEvent: event
          }
        })).then((modal: HTMLIonModalElement) => {
          modal.present();
        })
      },
      {
        text: '更换背景图'
      },
      { text: '取消', role: 'cancel' }
    ];

    this.overlayService.presentActionSheet(undefined, buttons);
  }

}
