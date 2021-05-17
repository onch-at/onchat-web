import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatSessionSelectorComponent } from '../components/modals/chat-session-selector/chat-session-selector.component';
import { EmptyModule } from './empty.module';
import { ScrollbarModule } from './scrollbar.module';
import { VirtualScrollPatchModule } from './virtual-scroll-patch.module';

@NgModule({
  declarations: [
    ChatSessionSelectorComponent
  ],
  imports: [
    EmptyModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollbarModule,
    VirtualScrollPatchModule
  ],
  exports: [
    ChatSessionSelectorComponent
  ]
})
export class ChatSessionSelectorModule { }
