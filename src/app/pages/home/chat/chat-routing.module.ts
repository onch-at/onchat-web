import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatroomResolve } from 'src/app/guards/chatroom.resolve';
import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage,
    resolve: {
      chatroomResult: ChatroomResolve
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule { }
