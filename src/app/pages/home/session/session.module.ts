import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmptyModule } from 'src/app/modules/empty.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { VirtualScrollPatchModule } from 'src/app/modules/virtual-scroll-patch.module';
import { MessageDescPipe } from 'src/app/pipes/message-desc.pipe';
import { SenderPipe } from 'src/app/pipes/sender.pipe';
import { SessionPageRoutingModule } from './session-routing.module';
import { SessionPage } from './session.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionPageRoutingModule,
    SharedModule,
    ScrollbarModule,
    EmptyModule,
    VirtualScrollPatchModule
  ],
  declarations: [
    SessionPage,
    MessageDescPipe,
    SenderPipe
  ]
})
export class SessionPageModule { }
