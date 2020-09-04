import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RichTextEditorComponent } from '../modals/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() { }

  editRichText() {
    this.modalController.create({
      component: RichTextEditorComponent
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
