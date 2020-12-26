import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // 主页
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  // 用户模块
  {
    path: 'user/login',
    loadChildren: () => import('./pages/user/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'user/register',
    loadChildren: () => import('./pages/user/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/user/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'user/avatar',
    loadChildren: () => import('./pages/user/avatar/avatar.module').then(m => m.AvatarPageModule)
  },
  {
    path: 'user/settings',
    loadChildren: () => import('./pages/user/settings/settings.module').then(m => m.SettingsPageModule)
  },
  // 聊天
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule)
  },
  // 好友模块
  {
    path: 'friend/request',
    loadChildren: () => import('./pages/friend/request/request.module').then(m => m.RequestPageModule)
  },
  {
    path: 'friend/handle',
    loadChildren: () => import('./pages/friend/handle/handle.module').then(m => m.HandlePageModule)
  },
  // 聊天室模块
  {
    path: 'chatroom/create',
    loadChildren: () => import('./pages/chatroom/create/create.module').then(m => m.CreatePageModule)
  },

  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/chatroom/home/home.module').then(m => m.HomePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
