export const environment = {
  production: true,

  indexUrl: '/onchat/index/',
  authUrl: '/onchat/auth/',
  userUrl: '/onchat/user/',
  chatUrl: '/onchat/chat/',
  chatroomUrl: '/onchat/chatroom/',
  chatRecordUrl: '/onchat/chat-record/',
  chatSessionUrl: '/onchat/chatsession',
  friendUrl: '/onchat/friend/',

  socketUrl: '',
  socketPath: '/ws/socket.io',

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
