import { Component, Input, OnInit } from '@angular/core';
import { NavigationCancel, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ContentChange } from 'ngx-quill';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { TEXT_MSG_MAX_LENGTH } from 'src/app/common/constant';
import { LocalStorageKey, MessageType, SocketEvent } from 'src/app/common/enum';
import { RichTextMessage } from 'src/app/models/form.model';
import { Message, Result } from 'src/app/models/onchat.model';
import { ChatPage } from 'src/app/pages/chat/chat.page';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OnChatService } from 'src/app/services/onchat.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { SocketService } from 'src/app/services/socket.service';
import { StrUtil } from 'src/app/utils/str.util';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent implements OnInit {
  @Input() page: ChatPage;

  html: string;
  text: string = '';
  subject: Subject<unknown> = new Subject();
  throttleTimer: number = null;

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

  constructor(
    public onChatService: OnChatService,
    private localStorageService: LocalStorageService,
    private overlayService: OverlayService,
    private socketService: SocketService,
    private modalController: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.onChatService.canDeactivate = false;

    this.html = this.localStorageService.getItemFromMap(LocalStorageKey.ChatRichTextMap, this.onChatService.chatroomId);

    this.router.events.pipe(
      filter(event => event instanceof NavigationCancel),
      takeUntil(this.subject)
    ).subscribe(() => {
      this.dismiss();
    });
  }

  /**
   * 关闭自己
   */
  dismiss() {
    this.modalController.dismiss();

    this.onChatService.canDeactivate = true;
    StrUtil.trimAll(this.text).length > 0 && this.cache();

  }

  showSendBtn() {
    return StrUtil.trimAll(this.text).length > 0;
  }

  /**
   * 发送
   */
  send() {
    if (this.text.length > TEXT_MSG_MAX_LENGTH) {
      return this.overlayService.presentToast('字数超出上限！');
    }

    const loading = this.overlayService.presentLoading('正在发送…');

    const message = new Message(+this.onChatService.chatroomId, MessageType.RichText);

    const subscription = this.socketService.on(SocketEvent.Message).subscribe((result: Result<Message>) => {
      const msg = result.data;
      // 如果请求成功，并且收到的消息是这个房间的
      if (result.code != 0 || msg.chatroomId != this.onChatService.chatroomId) {
        return subscription.unsubscribe();
      }

      // 如果是自己发的消息，并且是刚刚这一条
      if (msg.userId == this.onChatService.user.id && msg.sendTime == message.sendTime) {
        this.text = '';
        this.throttleTimer && clearTimeout(this.throttleTimer);
        this.localStorageService.removeItemFromMap(LocalStorageKey.ChatRichTextMap, this.onChatService.chatroomId);

        loading.then((loading: HTMLIonLoadingElement) => {
          loading.dismiss()
          this.dismiss();
          this.page.scrollToBottom();
        });

        subscription.unsubscribe();
      }
    });

    message.data = new RichTextMessage(this.html, this.text);
    this.socketService.message(message);
  }

  /**
   * 富文本变化时
   */
  onContentChanged(event: ContentChange) {
    this.text = event.text;

    if (this.throttleTimer === null && StrUtil.trimAll(this.text).length > 0) {
      this.throttleTimer = window.setTimeout(() => {
        this.cache();
        this.throttleTimer = null;
      }, 3000);
    }
  }

  /**
   * 缓存编辑的富文本到本地
   */
  cache() {
    this.throttleTimer && clearTimeout(this.throttleTimer);
    this.localStorageService.setItemToMap(
      LocalStorageKey.ChatRichTextMap,
      this.onChatService.chatroomId,
      this.html
    );
  }

}
