import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatListResolve } from 'src/app/guards/chatlist.resolve';
import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
    resolve: {
      chatList: ChatListResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule { }
