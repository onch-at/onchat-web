import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, SIGNATURE_MAX_LENGTH, SIGNATURE_MIN_LENGTH, USERNAME_MAX_LENGTH } from 'src/app/common/constant';
import { Gender, Mood, ResultCode, SessionStorageKey } from 'src/app/common/enum';
import { AvatarCropperComponent } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { UserInfo } from 'src/app/models/form.model';
import { Result } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  /** 昵称最大长度 */
  nicknameMaxLength: number = USERNAME_MAX_LENGTH;
  /** 个性签名最大长度 */
  signatureMaxLength: number = SIGNATURE_MAX_LENGTH;
  /** 性别枚举 */
  gender: typeof Gender = Gender;
  /** 月份别名 */
  monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  /** 今天的ISO时间 */
  today: string = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  /** 用户信息表单提交数据体 */
  userInfo: UserInfo = new UserInfo;
  /** 数据是否肮脏？ */
  dirty: boolean = false;
  /** 加载中 */
  loading: boolean = false;
  subject: Subject<unknown> = new Subject();

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
    private router: Router,
    private location: Location,
    public globalDataService: GlobalDataService,
    private onChatService: OnChatService,
    private overlayService: OverlayService,
    private modalController: ModalController,
    private sessionStorageService: SessionStorageService
  ) { }

  ngOnInit() {
    const { user } = this.globalDataService;
    const { controls } = this.userInfoForm;

    controls.nickname.setValue(user.nickname);
    controls.signature.setValue(user.signature);
    controls.mood.setValue(user.mood ?? Mood.Joy);
    controls.birthday.setValue(user.birthday ? new Date(user.birthday).toISOString() : this.today);
    controls.gender.setValue(user.gender ?? Gender.Secret);

    const subscription = this.userInfoForm.valueChanges.pipe(takeUntil(this.subject)).subscribe(() => {
      this.dirty = true;
      subscription.unsubscribe();
    });
  }

  /**
   * 消除表单控件的值的空格
   * @param controlName 控件名
   */
  trimAll(controlName: string) {
    this.userInfoForm.controls[controlName].setValue(StrUtil.trimAll(this.userInfoForm.value[controlName]));
  }

  /**
   * 提交
   */
  submit() {
    if (this.loading) { return; }
    this.loading = true;

    const { nickname, signature, mood, birthday, gender } = this.userInfoForm.value;

    this.userInfo.nickname = nickname;
    this.userInfo.signature = signature ? signature.trim() : null;
    this.userInfo.mood = mood;
    this.userInfo.birthday = Date.parse(birthday);
    this.userInfo.gender = +gender;

    this.onChatService.saveUserInfo(this.userInfo).subscribe((result: Result<UserInfo>) => {
      this.loading = false;

      if (result.code !== ResultCode.Success) {
        return this.overlayService.presentToast('用户信息修改失败！', 2000);
      }

      const { user } = this.globalDataService;

      this.globalDataService.user = { ...user, ...result.data };

      this.sessionStorageService.setItemToMap(
        SessionStorageKey.UserMap,
        user.id,
        this.globalDataService.user
      );

      // TODO
      this.location.back();
      this.overlayService.presentToast('用户信息修改成功！', 1000).then(() => {
        this.router.navigate(['/user', user.id]);
      });
    });
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

}
