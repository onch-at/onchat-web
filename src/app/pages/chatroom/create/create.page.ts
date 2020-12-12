import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CHATROOM_DESCRIPTION_MAX_LENGTH, CHATROOM_DESCRIPTION_MIN_LENGTH, CHATROOM_NAME_MAX_LENGTH, CHATROOM_NAME_MIN_LENGTH } from 'src/app/common/constant';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  nameMaxLength: number = CHATROOM_NAME_MAX_LENGTH;
  descriptionMaxLength: number = CHATROOM_DESCRIPTION_MAX_LENGTH;
  loading: boolean = false;

  chatroomForm: FormGroup = this.fb.group({
    name: [
      null, [
        Validators.required,
        Validators.minLength(CHATROOM_NAME_MIN_LENGTH),
        Validators.maxLength(CHATROOM_NAME_MAX_LENGTH)
      ]
    ],
    description: [
      null, [
        Validators.minLength(CHATROOM_DESCRIPTION_MIN_LENGTH),
        Validators.maxLength(CHATROOM_DESCRIPTION_MAX_LENGTH)
      ]
    ]
  });

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
  }

  trim(controlName: string) {
    this.chatroomForm.controls[controlName].setValue(this.chatroomForm.value[controlName].trim());
  }

  submit() {

  }

  nameFeedback(errors: ValidationErrors) {
    if (errors.required) {
      return '聊天室名称不能为空！';
    } else if (errors.minlength || errors.maxlength) {
      return `聊天室名称长度必须在${CHATROOM_NAME_MIN_LENGTH}~${CHATROOM_NAME_MAX_LENGTH}位字符之间！`;
    }
  }

  descriptionFeedback(errors: ValidationErrors) {
    if (errors.minlength || errors.maxlength) {
      return `聊天室简介长度必须在${CHATROOM_DESCRIPTION_MIN_LENGTH}~${CHATROOM_DESCRIPTION_MAX_LENGTH}位字符之间！`;
    }
  }
}
