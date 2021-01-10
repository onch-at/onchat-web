import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { DrawerComponent } from 'src/app/components/drawer/drawer.component';
import { RichTextEditorComponent } from 'src/app/components/modals/rich-text-editor/rich-text-editor.component';
import { BubbleToolbarComponent } from 'src/app/components/popovers/bubble-toolbar/bubble-toolbar.component';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { MsgListComponent } from '../../components/msg-list/msg-list.component';
import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    SharedModule,
    ActiveClassModule,
    HideScrollbarModule,
    QuillModule.forRoot({
      placeholder: '在此处插入文字…'
    }),
    ClipboardModule
  ],
  declarations: [
    ChatPage,
    MsgListComponent,
    BubbleToolbarComponent,
    DrawerComponent,
    RichTextEditorComponent
  ]
})
export class ChatPageModule { }
