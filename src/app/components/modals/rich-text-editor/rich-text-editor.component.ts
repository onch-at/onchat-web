import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ContentChange } from 'ngx-quill';
import { OnChatService } from 'src/app/services/onchat.service';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
})
export class RichTextEditorComponent implements OnInit {
  content: string;

  config = {
    toolbar: [

      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      [{ 'color': [] }],
      ['blockquote', 'code-block'],             // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'align': [] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      ['clean'],                                         // remove formatting button
      // ['link', 'image', 'video']                         // link and image, video
    ]
  };

  constructor(
    public onChatService: OnChatService,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.onChatService.canDeactivate = false;
  }

  /**
   * 关闭自己
   */
  dismiss() {
    this.modalController.dismiss();
    this.onChatService.canDeactivate = true;
  }

  onContentChanged(e: ContentChange) {
    console.log(e.html);

  }

}
