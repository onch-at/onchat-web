import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { ChatDrawerComponent } from 'src/app/components/chat-drawer/chat-drawer.component';
import { CardMessageComponent } from 'src/app/components/messages/card-message/card-message.component';
import { ImageMessageComponent } from 'src/app/components/messages/image-message/image-message.component';
import { TipsMessageComponent } from 'src/app/components/messages/tips-message/tips-message.component';
import { ImagePreviewerComponent } from 'src/app/components/modals/image-previewer/image-previewer.component';
import { RichTextEditorComponent } from 'src/app/components/modals/rich-text-editor/rich-text-editor.component';
import { BubbleToolbarComponent } from 'src/app/components/popovers/bubble-toolbar/bubble-toolbar.component';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { SwiperModule } from 'swiper/angular';
import { MessageListComponent } from '../../components/message-list/message-list.component';
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
    ScrollbarModule,
    QuillModule,
    ClipboardModule,
    RippleModule,
    SwiperModule
  ],
  declarations: [
    ChatPage,
    MessageListComponent,
    TipsMessageComponent,
    ImageMessageComponent,
    CardMessageComponent,
    BubbleToolbarComponent,
    ChatDrawerComponent,
    RichTextEditorComponent,
    ImagePreviewerComponent
  ]
})
export class ChatPageModule { }
