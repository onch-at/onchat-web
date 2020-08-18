import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'user/login',
    loadChildren: () => import('./pages/user/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'user/register',
    loadChildren: () => import('./pages/user/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'user/card',
    loadChildren: () => import('./pages/user/card/card.module').then(m => m.CardPageModule)
  },
  {
    path: 'user/avatar',
    loadChildren: () => import('./pages/user/avatar/avatar.module').then(m => m.AvatarPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule)
  },
  {
    path: 'friend/request',
    loadChildren: () => import('./pages/friend/request/request.module').then(m => m.RequestPageModule)
  },
  {
    path: 'friend/handle',
    loadChildren: () => import('./pages/friend/handle/handle.module').then(m => m.HandlePageModule)
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
