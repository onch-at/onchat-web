import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MoodRadioComponent } from 'src/app/components/mood-radio/mood-radio.component';
import { SharedModule } from 'src/app/modules/shared.module';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SharedModule,
    SettingsPageRoutingModule
  ],
  declarations: [
    SettingsPage,
    MoodRadioComponent
  ]
})
export class SettingsPageModule { }
