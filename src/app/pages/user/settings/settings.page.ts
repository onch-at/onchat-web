import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, SIGNATURE_MAX_LENGTH, SIGNATURE_MIN_LENGTH, USERNAME_MAX_LENGTH } from 'src/app/common/constant';
import { Gender, Mood, ResultCode } from 'src/app/common/enum';
import { ValidationFeedback } from 'src/app/common/interface';
import { AvatarCropperComponent } from 'src/app/components/modals/avatar-cropper/avatar-cropper.component';
import { UserInfo } from 'src/app/models/form.model';
import { Result } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { StrUtil } from 'src/app/utils/str.util';
import { SysUtil } from 'src/app/utils/sys.util';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private subject: Subject<unknown> = new Subject();
  /** 昵称最大长度 */
  nicknameMaxLength: number = USERNAME_MAX_LENGTH;
  /** 个性签名最大长度 */
  signatureMaxLength: number = SIGNATURE_MAX_LENGTH;
  /** 性别枚举 */
  gender: typeof Gender = Gender;
  /** 月份别名 */
  monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  /** 初始时间 */
  min: string = new Date(new Date().getFullYear() - 100, 0, 2).toISOString();
  /** 今天的ISO时间 */
  today: string = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  /** 用户信息表单提交数据体 */
  userInfo: UserInfo = new UserInfo;
  /** 数据是否肮脏？ */
  dirty: boolean = false;
  /** 加载中 */
  loading: boolean = false;

  userInfoForm: FormGroup = this.fb.group({
    nickname: [
      '', [
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

  nicknameFeedback: ValidationFeedback = (errors: ValidationErrors) => {
    if (!errors) { return; }
    if (errors.required) {
      return '昵称不能为空！';
    } else if (errors.minlength || errors.maxlength) {
      return `昵称长度必须在${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}位字符之间！`;
    }
  }

  signatureFeedback: ValidationFeedback = (errors: ValidationErrors) => {
    if (!errors) { return; }
    if (errors.minlength || errors.maxlength) {
      return `个性签名长度必须在${SIGNATURE_MIN_LENGTH}~${SIGNATURE_MAX_LENGTH}位字符之间！`;
    }
  }

  constructor(
    public globalData: GlobalData,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private onChatService: OnChatService,
    private overlayService: OverlayService
  ) { }

  ngOnInit() {
    const { user } = this.globalData;

    this.userInfoForm.setValue({
      nickname: user.nickname,
      signature: user.signature,
      mood: user.mood ?? Mood.Joy,
      birthday: user.birthday ? new Date(user.birthday).toISOString() : this.today,
      gender: user.gender ?? Gender.Secret
    });

    this.userInfoForm.valueChanges.pipe(
      takeUntil(this.subject),
      first()
    ).subscribe(() => {
      this.dirty = true;
    });
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  /**
   * 消除表单控件的值的空格
   * @param controlName 控件名
   */
  trimAll(controlName: string) {
    const value = StrUtil.trimAll(this.userInfoForm.get(controlName).value);
    this.userInfoForm.controls[controlName].setValue(value);
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

      const { user } = this.globalData;

      this.globalData.user = { ...user, ...result.data };

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
        handler: () => SysUtil.uploadFile('image/*').then((event: Event) => this.overlayService.presentModal({
          component: AvatarCropperComponent,
          componentProps: {
            imageChangedEvent: event
          }
        }))
      },
      {
        text: '更换背景图'
      },
      {
        text: '取消',
        role: 'cancel'
      }
    ];

    this.overlayService.presentActionSheet(buttons);
  }

}
