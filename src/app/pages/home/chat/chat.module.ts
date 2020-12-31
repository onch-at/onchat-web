import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    SharedModule,
    HideScrollbarModule
  ],
  declarations: [ChatPage]
})
export class ChatPageModule { }
