import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ActiveClassDirective } from 'src/app/directives/active-class.directive';
import { DetailDatePipe } from 'src/app/pipes/detail-date.pipe';
import { AvatarCropperComponent } from '../components/modals/avatar-cropper/avatar-cropper.component';
import { HideScrollbarDirective } from '../directives/hide-scrollbar.directive';
import { GenderPipe } from '../pipes/gender.pipe';
import { HtmlPipe } from '../pipes/html.pipe';
import { HyperlinkPipe } from '../pipes/hyperlink.pipe';
import { NumLimitPipe } from '../pipes/num-limit.pipe';

@NgModule({
  declarations: [
    ActiveClassDirective,
    HideScrollbarDirective,
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe,
    HyperlinkPipe,
    GenderPipe,
    AvatarCropperComponent
  ],
  imports: [
    ImageCropperModule,
    CommonModule,
    IonicModule
  ],
  exports: [
    ImageCropperModule,
    ActiveClassDirective,
    HideScrollbarDirective,
    DetailDatePipe,
    NumLimitPipe,
    HtmlPipe,
    HyperlinkPipe,
    GenderPipe,
    AvatarCropperComponent
  ]
})
export class SharedModule { }
