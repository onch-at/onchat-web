import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentChange } from 'ngx-quill';
import { filter, take } from 'rxjs/operators';
import { TEXT_MSG_MAX_LENGTH } from 'src/app/common/constant';
import { Throttle } from 'src/app/common/decorator';
import { LocalStorageKey, MessageType, ResultCode, SocketEvent } from 'src/app/common/enum';
import { MessageEntity } from 'src/app/entities/message.entity';
import { RichTextMessage } from 'src/app/models/msg.model';
import { Message, Result } from 'src/app/models/onchat.model';
import { GlobalData } from 'src/app/services/global-data.service';
import { LocalStorage } from 'src/app/services/local-storage.service';
import { Overlay } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent extends ModalComponent implements OnInit {
  html: string = '';
  text: string = '';

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['clean'],
    ]
  };

  canSend = () => this.html && StrUtil.trimAll(this.html).length > 0;

  constructor(
    private globalData: GlobalData,
    private injector: Injector,
    private localStorage: LocalStorage,
    private socketService: SocketService,
    protected overlay: Overlay,
    protected router: Router,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.html = this.localStorage.getItemFromMap(LocalStorageKey.ChatRichTextMap, this.globalData.chatroomId);
  }

  /**
   * 发送
   */
  async send() {
    if (this.text.length > TEXT_MSG_MAX_LENGTH) {
      return this.overlay.presentToast('字数超出上限！');
    }

    const loading = await this.overlay.presentLoading('Sending…');
    const { chatroomId, user } = this.globalData;
    const msg = new MessageEntity(MessageType.RichText).inject(this.injector);
    msg.chatroomId = chatroomId;
    msg.userId = user.id;
    msg.avatarThumbnail = user.avatarThumbnail;
    msg.data = new RichTextMessage(this.html, this.text);

    this.dismiss(msg);
    loading.dismiss();

    this.socketService.on(SocketEvent.Message).pipe(
      filter(({ code, data }: Result<Message>) => (
        code === ResultCode.Success && msg.isSelf(data)
      )),
      take(1)
    ).subscribe(() => {
      this.localStorage.removeItemFromMap(LocalStorageKey.ChatRichTextMap, chatroomId);
    });
  }

  /**
   * 富文本变化时
   */
  onContentChanged({ text }: ContentChange) {
    this.text = text;
  }

  /**
   * 缓存编辑的富文本到本地
   */
  @Throttle(1000)
  cache() {
    StrUtil.trimAll(this.text).length && this.localStorage.setItemToMap(
      LocalStorageKey.ChatRichTextMap,
      this.globalData.chatroomId,
      this.html
    );
  }

}
