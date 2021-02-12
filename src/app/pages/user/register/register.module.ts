import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmailBinderComponent } from 'src/app/components/modals/email-binder/email-binder.component';
import { ActiveClassModule } from 'src/app/modules/active-class.module';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    ActiveClassModule
  ],
  declarations: [
    RegisterPage,
    EmailBinderComponent
  ]
})
export class RegisterPageModule { }
