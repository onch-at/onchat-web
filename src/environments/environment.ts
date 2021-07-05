// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  indexUrl: '/onchat/index/',
  userUrl: '/onchat/user/',
  chatUrl: '/onchat/chat/',
  chatroomUrl: '/onchat/chatroom/',
  chatRecordUrl: '/onchat/chat-record/',
  chatSessionUrl: '/onchat/chatsession',
  friendUrl: '/onchat/friend/',

  socketUrl: '',
  socketPath: '/ws/socket.io',
};
