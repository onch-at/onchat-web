import { Component, OnInit } from '@angular/core';
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
export class SafetyPage implements OnInit {

  constructor(
    public globalData: GlobalData,
    private overlay: Overlay,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
  }

  bindEmail() {
    this.overlay.presentModal({
      component: EmailBinderComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

  changePassword() {
    this.overlay.presentModal({
      component: PasswordModifierComponent,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
  }

}
