import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SharedModule } from 'src/app/modules/shared.module';
import { VirtualScrollPatchModule } from 'src/app/modules/virtual-scroll-patch.module';
import { MsgDescPipe } from 'src/app/pipes/msg-desc.pipe';
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
    VirtualScrollPatchModule
  ],
  declarations: [
    SessionPage,
    MsgDescPipe,
    SenderPipe
  ]
})
export class SessionPageModule { }
