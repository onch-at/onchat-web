import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ChatListResolve } from 'src/app/guards/chatlist.resolve';
import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
    canActivate: [
      AuthGuard
    ],
    canLoad: [
      AuthGuard
    ],
    resolve: {
      chatListResult: ChatListResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule { }
