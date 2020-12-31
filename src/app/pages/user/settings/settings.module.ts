import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoodRadioComponent } from 'src/app/components/mood-radio/mood-radio.component';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { HideScrollbarModule } from 'src/app/modules/hide-scrollbar.module';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ActiveClassModule,
    HideScrollbarModule,
    SettingsPageRoutingModule
  ],
  declarations: [
    SettingsPage,
    MoodRadioComponent
  ]
})
export class SettingsPageModule { }
