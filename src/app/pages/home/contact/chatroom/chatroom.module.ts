import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShareModule } from 'src/app/modules/share/share.module';
import { ChatroomPageRoutingModule } from './chatroom-routing.module';
import { ChatroomPage } from './chatroom.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatroomPageRoutingModule,
    ShareModule
  ],
  declarations: [ChatroomPage]
})
export class ChatroomPageModule {}
