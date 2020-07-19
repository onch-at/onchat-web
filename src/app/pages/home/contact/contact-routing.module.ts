import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuddyComponent } from './buddy/buddy.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ContactPage } from './contact.page';
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
        path: 'buddy',
        component: BuddyComponent,
        data: { animation: 2 }
      },
      {
        path: 'chatroom',
        component: ChatroomComponent,
        data: { animation: 3 }
      },
      {
        path: '**',
        redirectTo: '/home/contact/buddy',
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
