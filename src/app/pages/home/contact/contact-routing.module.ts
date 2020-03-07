import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactPage } from './contact.page';


const routes: Routes = [
  {
    path: '',
    component: ContactPage,
    children: [
      {
        path: 'add',
        loadChildren: () => import('./add/add.module').then(m => m.AddPageModule)
      },
      {
        path: 'buddy',
        loadChildren: () => import('./buddy/buddy.module').then(m => m.BuddyPageModule)
      },
      {
        path: 'chatroom',
        loadChildren: () => import('./chatroom/chatroom.module').then(m => m.ChatroomPageModule)
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
