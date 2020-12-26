import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ContactPage } from './contact.page';
import { FriendComponent } from './friend/friend.component';
import { NewComponent } from './new/new.component';

const routes: Routes = [
  {
    path: '',
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
        redirectTo: '/home/contact/friend',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactPageRoutingModule { }
