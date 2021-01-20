import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { HandlePageRoutingModule } from './handle-routing.module';
import { HandlePage } from './handle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HideScrollbarModule,
    ActiveClassModule,
    HandlePageRoutingModule,
    RippleModule
  ],
  declarations: [
    HandlePage,
  ]
})
export class HandlePageModule { }
