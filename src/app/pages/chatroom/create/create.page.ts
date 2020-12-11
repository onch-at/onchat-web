import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CHATROOM_NAME_MAX_LENGTH, CHATROOM_NAME_MIN_LENGTH } from 'src/app/common/constant';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  chatroomNameMaxLength: number = CHATROOM_NAME_MAX_LENGTH;
  loading: boolean = false;

  chatroomForm: FormGroup = this.fb.group({
    chatroomName: [
      null, [
        Validators.required,
        Validators.minLength(CHATROOM_NAME_MIN_LENGTH),
        Validators.maxLength(CHATROOM_NAME_MAX_LENGTH)
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

  chatroomNameFeedback(errors: ValidationErrors) {
    if (errors.required) {
      return '聊天室名称不能为空！';
    } else if (errors.minlength || errors.maxlength) {
      return `聊天室名称长度必须在${CHATROOM_NAME_MIN_LENGTH}~${CHATROOM_NAME_MAX_LENGTH}位字符之间！`;
    }
  }
}
