import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { RippleModule } from 'src/app/modules/ripple.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { ResetPageRoutingModule } from './reset-routing.module';
import { ResetPage } from './reset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ResetPageRoutingModule,
    ScrollbarModule,
    ActiveClassModule,
    RippleModule
  ],
  declarations: [ResetPage]
})
export class ResetPageModule { }
