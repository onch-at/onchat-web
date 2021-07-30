import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoodRadioComponent } from 'src/app/components/mood-radio/mood-radio.component';
import { ActiveClassModule } from 'src/app/directives/active-class/active-class.module';
import { ScrollbarModule } from 'src/app/directives/scrollbar/scrollbar.module';
import { InfoPageRoutingModule } from './info-routing.module';
import { InfoPage } from './info.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ActiveClassModule,
    ScrollbarModule,
    InfoPageRoutingModule
  ],
  declarations: [
    InfoPage,
    MoodRadioComponent
  ]
})
export class InfoPageModule { }
