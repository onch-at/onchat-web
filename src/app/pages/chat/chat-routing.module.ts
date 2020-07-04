import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: ':id',
    component: ChatPage,
    resolve: {
      // userId: UserIdResolve
    },
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
export class ChatPageRoutingModule { }
