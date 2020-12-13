import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CHATROOM_DESCRIPTION_MAX_LENGTH, CHATROOM_DESCRIPTION_MIN_LENGTH, CHATROOM_NAME_MAX_LENGTH, CHATROOM_NAME_MIN_LENGTH } from 'src/app/common/constant';
import { ChatItem, Result } from 'src/app/models/onchat.model';
import { GlobalDataService } from 'src/app/services/global-data.service';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {
  nameMaxLength: number = CHATROOM_NAME_MAX_LENGTH;
  descriptionMaxLength: number = CHATROOM_DESCRIPTION_MAX_LENGTH;
  loading: boolean = false;

  originPrivateChatrooms: (ChatItem & { checked: boolean })[] = []
  privateChatroomsPage: number = 1;

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
    private onChatService: OnChatService,
    public globalDataService: GlobalDataService,
  ) { }

  ngOnInit() {
    const push = (privateChatrooms: ChatItem[]) => {
      for (const item of privateChatrooms) {
        this.originPrivateChatrooms.push({ ...item, checked: false });
      }
    }

    if (this.globalDataService.privateChatrooms.length) {
      push(this.originPrivateChatrooms);
    } else {
      this.onChatService.getPrivateChatrooms().subscribe((result: Result<ChatItem[]>) => {
        if (result.code !== 0) { return; }

        this.globalDataService.privateChatrooms = result.data;
        push(result.data);
      });
    }
  }

  trim(controlName: string) {
    this.chatroomForm.controls[controlName].setValue(this.chatroomForm.value[controlName].trim());
  }

  submit() {

  }

  delete(item: ChatItem & { checked: boolean }) {
    item.checked = false;
  }

  privateChatrooms() {
    return this.privateChatroomsPage ? this.originPrivateChatrooms.slice(0, this.privateChatroomsPage * 10) : this.originPrivateChatrooms;
  }

  /**
   * 加载更多
   * @param event
   */
  loadData(event: any) {
    if (!this.privateChatroomsPage) {
      return event.target.complete();
    }

    if (++this.privateChatroomsPage * 10 >= this.globalDataService.privateChatrooms.length) {
      this.privateChatroomsPage = null;
    }

    event.target.complete();
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
