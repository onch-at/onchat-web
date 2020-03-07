import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatroomPageRoutingModule } from './chatroom-routing.module';

import { ChatroomPage } from './chatroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatroomPageRoutingModule
  ],
  declarations: [ChatroomPage]
})
export class ChatroomPageModule {}
