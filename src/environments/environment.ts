// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  captchaUrl: '/onchat/index/captcha',

  userUrl: '/onchat/user/',

  userIdUrl: '/onchat/user/id',
  userLoginUrl: '/onchat/user/login',
  userRegisterUrl: '/onchat/user/register',
  userLogoutUrl: '/onchat/user/logout',
  userCheckLoginUrl: '/onchat/user/checklogin',
  userChatroomsUrl: '/onchat/user/chatrooms',
  userChatListUrl: '/onchat/user/chatlist',
  chatListStickyUrl: '/onchat/user/chatlist/sticky/',
  chatListUnstickyUrl: '/onchat/user/chatlist/unsticky/',
  chatListReadedUrl: '/onchat/user/chatlist/readed/',
  chatListUnreadUrl: '/onchat/user/chatlist/unread/',

  chatroomUrl: '/onchat/chatroom/',

  friendUrl: '/onchat/friend/',

  socketUrl: 'https://onchat.dev',
};
