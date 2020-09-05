import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatPage } from 'src/app/pages/chat/chat.page';
import { RichTextEditorComponent } from '../modals/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  @Input() page: ChatPage;

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  editRichText() {
    this.modalController.create({
      component: RichTextEditorComponent,
      componentProps: {
        page: this.page
      }
    }).then((modal: HTMLIonModalElement) => {
      modal.present();
      // modal.onWillDismiss().then((e: { data: SafeUrl }) => {
      //   if (e.data) {
      //     this.user.avatar = e.data as string;
      //   }
      // });
    });
  }

}
