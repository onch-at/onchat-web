import { Component } from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular';
import { EmailBinderComponent } from 'src/app/components/modals/email-binder/email-binder.component';
import { PasswordModifierComponent } from 'src/app/components/modals/password-modifier/password-modifier.component';
import { GlobalData } from 'src/app/services/global-data.service';
import { Overlay } from 'src/app/services/overlay.service';

@Component({
  selector: 'app-safety',
  templateUrl: './safety.page.html',
  styleUrls: ['./safety.page.scss'],
})
export class SafetyPage {

  constructor(
    public globalData: GlobalData,
    private overlay: Overlay,
    private routerOutlet: IonRouterOutlet
  ) { }

  bindEmail() {
    this.overlay.modal({
      component: EmailBinderComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

  changePassword() {
    this.overlay.modal({
      component: PasswordModifierComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

}
