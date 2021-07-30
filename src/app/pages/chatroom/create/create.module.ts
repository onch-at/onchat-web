import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScrollbarModule } from 'src/app/directives/scrollbar/scrollbar.module';
import { CreatePageRoutingModule } from './create-routing.module';
import { CreatePage } from './create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreatePageRoutingModule,
    ScrollbarModule
  ],
  declarations: [CreatePage]
})
export class CreatePageModule { }
