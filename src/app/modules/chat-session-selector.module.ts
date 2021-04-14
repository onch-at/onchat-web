import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatSessionSelectorComponent } from '../components/modals/chat-session-selector/chat-session-selector.component';
import { ScrollbarModule } from './scrollbar.module';

@NgModule({
  declarations: [
    ChatSessionSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollbarModule
  ],
  exports: [
    ChatSessionSelectorComponent
  ]
})
export class ChatSessionSelectorModule { }
