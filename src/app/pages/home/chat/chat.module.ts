import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { MsgDescPipe } from 'src/app/pipes/msg-desc.pipe';
import { SenderPipe } from 'src/app/pipes/sender.pipe';
import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    SharedModule,
    ScrollbarModule
  ],
  declarations: [
    ChatPage,
    MsgDescPipe,
    SenderPipe
  ]
})
export class ChatPageModule { }
