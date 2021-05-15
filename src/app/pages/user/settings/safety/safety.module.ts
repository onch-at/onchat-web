import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmailBinderComponent } from 'src/app/components/modals/email-binder/email-binder.component';
import { PasswordModifierComponent } from 'src/app/components/modals/password-modifier/password-modifier.component';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { ScrollbarModule } from 'src/app/modules/scrollbar.module';
import { SafetyPageRoutingModule } from './safety-routing.module';
import { SafetyPage } from './safety.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ActiveClassModule,
    ScrollbarModule,
    SafetyPageRoutingModule
  ],
  declarations: [
    SafetyPage,
    PasswordModifierComponent,
    EmailBinderComponent
  ]
})
export class SafetyPageModule { }
