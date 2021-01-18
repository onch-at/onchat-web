import { Component, Input, OnInit } from '@angular/core';
import { ChatPage } from 'src/app/pages/chat/chat.page';
import { OverlayService } from 'src/app/services/overlay.service';
import { RichTextEditorComponent } from '../modals/rich-text-editor/rich-text-editor.component';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
})
export class DrawerComponent implements OnInit {
  @Input() page: ChatPage;

  constructor(
    private overlayService: OverlayService,
  ) { }

  ngOnInit() { }

  editRichText() {
    this.overlayService.presentModal({
      component: RichTextEditorComponent,
      componentProps: {
        page: this.page
      }
    });
  }

}
