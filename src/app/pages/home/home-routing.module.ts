import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CanDeactivateGuard } from 'src/app/guards/can-deactivate.guard';
import { ChatroomComponent } from './contact/chatroom/chatroom.component';
import { ContactPage } from './contact/contact.page';
import { FriendComponent } from './contact/friend/friend.component';
import { NewComponent } from './contact/new/new.component';
import { HomePage } from './home.page';
import { ProfilePage } from './profile/profile.page';
import { SessionPage } from './session/session.page';
import { SettingsPage } from './settings/settings.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    canActivate: [
      AuthGuard
    ],
    canLoad: [
      AuthGuard
    ],
    children: [
      {
        path: 'session',
        component: SessionPage
      },
      {
        path: 'contact',
        component: ContactPage,
        children: [
          {
            path: 'new',
            component: NewComponent,
            data: { animation: 1 }
          },
          {
            path: 'friend',
            component: FriendComponent,
            data: { animation: 2 }
          },
          {
            path: 'chatroom',
            component: ChatroomComponent,
            data: { animation: 3 }
          },
          {
            path: '**',
            redirectTo: 'friend',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'settings',
        component: SettingsPage
      },
      {
        path: 'profile',
        component: ProfilePage,
        canDeactivate: [
          CanDeactivateGuard
        ]
      },
      {
        path: '**',
        redirectTo: 'session',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home/session',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }
