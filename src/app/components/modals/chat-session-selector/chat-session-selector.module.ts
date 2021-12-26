import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ForTrackByIdModule } from 'src/app/directives/for-track-by-id/for-track-by-id.module';
import { ScrollbarModule } from '../../../directives/scrollbar/scrollbar.module';
import { EmptyModule } from '../../empty/empty.module';
import { ChatSessionSelectorComponent } from './chat-session-selector.component';

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
    ScrollingModule,
    ForTrackByIdModule
  ],
  exports: [
    ChatSessionSelectorComponent
  ]
})
export class ChatSessionSelectorModule { }
