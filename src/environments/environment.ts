// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  indexCtx: '/onchat/http/index',
  authCtx: '/onchat/http/auth',
  userCtx: '/onchat/http/user',
  chatCtx: '/onchat/http/chat',
  chatroomCtx: '/onchat/http/chatroom',
  chatRecordCtx: '/onchat/http/chat-record',
  chatSessionCtx: '/onchat/http/chatsession',
  friendCtx: '/onchat/http/friend',

  socketioPath: '/onchat/ws/socket.io',

  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
        'stun:stun.qq.com:3478',
      ]
    },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'muazkh',
      username: 'webrtc@live.com'
    },
    {
      urls: 'turn:numb.viagenie.ca',
      credential: 'webrtc',
      username: 'hyperlife1119@qq.com'
    },
  ]
};
