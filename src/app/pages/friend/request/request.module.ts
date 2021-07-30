import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/directives/active-class/active-class.module';
import { RippleModule } from 'src/app/directives/ripple/ripple.module';
import { ScrollbarModule } from 'src/app/directives/scrollbar/scrollbar.module';
import { RequestPageRoutingModule } from './request-routing.module';
import { RequestPage } from './request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollbarModule,
    ActiveClassModule,
    RequestPageRoutingModule,
    RippleModule
  ],
  declarations: [RequestPage]
})
export class RequestPageModule { }
