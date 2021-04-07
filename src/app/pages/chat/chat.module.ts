import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QuillModule } from 'ngx-quill';
import { DrawerComponent } from 'src/app/components/drawer/drawer.component';
import { ImagePreviewerComponent } from 'src/app/components/modals/image-previewer/image-previewer.component';
import { RichTextEditorComponent } from 'src/app/components/modals/rich-text-editor/rich-text-editor.component';
import { BubbleToolbarComponent } from 'src/app/components/popovers/bubble-toolbar/bubble-toolbar.component';
import { ImageSizeDirective } from 'src/app/directives/image-size.directive';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { SwiperModule } from 'swiper/angular';
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
    QuillModule,
    ClipboardModule,
    RippleModule,
    SwiperModule
  ],
  declarations: [
    ChatPage,
    ImageSizeDirective,
    MsgListComponent,
    BubbleToolbarComponent,
    DrawerComponent,
    RichTextEditorComponent,
    ImagePreviewerComponent
  ]
})
export class ChatPageModule { }
