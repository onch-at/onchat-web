import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentChange } from 'ngx-quill';
import { filter, take } from 'rxjs/operators';
import { Throttle } from 'src/app/common/decorators';
import { SocketEvent } from 'src/app/common/enums';
import { success } from 'src/app/common/operators';
import { TEXT_MSG_MAX_LENGTH } from 'src/app/constants';
import { RichTextMessageEntity } from 'src/app/entities/rich-text-message.entity';
import { RichTextMessage } from 'src/app/models/msg.model';
import { Message, Result } from 'src/app/models/onchat.model';
import { Destroyer } from 'src/app/services/destroyer.service';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';
import { Socket } from 'src/app/services/socket.service';
import { StrUtils } from 'src/app/utilities/str.utils';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [Destroyer]
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

  canSend = () => this.text && StrUtils.trimAll(this.text).length > 0;

  constructor(
    private injector: Injector,
    private globalData: GlobalData,
    private socket: Socket,
    protected overlay: Overlay,
    protected router: Router,
    protected destroyer: Destroyer,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.html = this.globalData.chatRichTextMap[this.globalData.chatroomId];
    this.text = StrUtils.html(this.html);
  }

  /**
   * 发送
   */
  async send() {
    if (this.text.length > TEXT_MSG_MAX_LENGTH) {
      return this.overlay.toast('字数超出上限！');
    }

    const loading = await this.overlay.loading('Sending…');
    const { chatroomId, user, chatRichTextMap } = this.globalData;
    const msg = new RichTextMessageEntity(new RichTextMessage(this.html, this.text)).inject(this.injector);
    msg.chatroomId = chatroomId;
    msg.userId = user.id;
    msg.avatarThumbnail = user.avatarThumbnail;

    this.dismiss(msg);
    loading.dismiss();

    this.socket.on(SocketEvent.Message).pipe(
      success(),
      filter(({ data }: Result<Message>) => msg.isSelf(data)),
      take(1)
    ).subscribe(() => {
      chatRichTextMap[chatroomId] = null;
      this.globalData.chatRichTextMap = chatRichTextMap;
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
  @Throttle(500)
  cache() {
    if (StrUtils.trimAll(this.text).length) {
      const { chatroomId, chatRichTextMap } = this.globalData;
      chatRichTextMap[chatroomId] = this.html;
      this.globalData.chatRichTextMap = chatRichTextMap;
    }
  }

}
