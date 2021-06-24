import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { SearchPage } from './search.page';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: '',
    component: SearchPage,
    children: [
      {
        path: '',
        component: UserComponent,
        data: { animation: 1 }
      },
      {
        path: 'chatroom',
        component: ChatroomComponent,
        data: { animation: 2 }
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ],
    canActivate: [
      AuthGuard
    ],
    canLoad: [
      AuthGuard
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SearchPageRoutingModule { }
