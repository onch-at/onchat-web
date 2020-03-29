import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ShareModule } from 'src/app/modules/share/share.module';
import { NumLimitPipe } from 'src/app/pipes/num-limit.pipe';
import { ChatPageRoutingModule } from './chat-routing.module';
import { ChatPage } from './chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    ShareModule,
    LazyLoadImageModule
  ],
  declarations: [ChatPage, NumLimitPipe]
})
export class ChatPageModule { }
