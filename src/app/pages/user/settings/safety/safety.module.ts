import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SafetyPageRoutingModule } from './safety-routing.module';
import { SafetyPage } from './safety.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveClassModule,
    ScrollbarModule,
    SafetyPageRoutingModule
  ],
  declarations: [SafetyPage]
})
export class SafetyPageModule { }
