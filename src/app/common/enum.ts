export enum ResultCode {
    /** 权限不足 */
    ErrorNoPermission = -3,
    /** 参数错误 */
    ErrorParam = -2,
    /** 未知错误 */
    ErrorUnknown = -1,
    /** 成功 */
    Success = 0,
}

/** 枚举周 */
export enum WeekDay {
    Sunday = '周日',
    Monday = '周一',
    Tuesday = '周二',
    Wednesday = '周三',
    Thursday = '周四',
    Friday = '周五',
    Saturday = '周六',
}

/** 枚举天 */
export enum Day {
    Today = '今天',
    Yesterday = '昨天'
}

/** 枚举Socket事件 */
export enum SocketEvent {
    /** 连接打通时 */
    Connect = 'connect',
    /** 连接断开时 */
    Disconnect = 'disconnect',
    /** 重新连接时 */
    Reconnect = 'reconnect',
    /** 连接失败时 */
    ReconnectError = 'reconnect_error',
    /** 初始化 */
    Init = 'init',
    /** 卸载时 */
    Unload = 'unload',
    /** 接收到消息时 */
    Message = 'message',
    /** 收到撤回消息 */
    RevokeMsg = 'revoke_msg',
    /** 好友申请 */
    FriendRequest = 'friend_request',
    /** 同意好友申请 */
    FriendRequestAgree = 'friend_request_agree',
    /** 拒绝好友申请 */
    FriendRequestReject = 'friend_request_reject',
    /** 创建聊天室 */
    CreateChatroom = 'create_chatroom',
    /** 邀请好友入群 */
    InviteJoinChatroom = 'invite_join_chatroom',
    /** 聊天申请（加群申请） */
    ChatRequest = 'chat_request',
}

/** 枚举消息类型 */
export enum MessageType {
    /** 系统消息 */
    System = 0,
    /** 文本 */
    Text = 1,
    /** 富文本 */
    RichText = 2,
    /** 文字提示 */
    Tips = 3,
    /** 群聊邀请 */
    ChatInvitation = 4
}

/** 枚举聊天会话类型 */
export enum ChatSessionType {
    /** 聊天室 */
    Chatroom = 0,
    /** 聊天室通知 */
    ChatroomNotice = 1
}

/** 好友申请的状态 */
export enum FriendRequestStatus {
    /** 等待验证 */
    Wait = 0,
    /** 同意 */
    Agree = 1,
    /** 拒绝 */
    Reject = 2,
    /** 删除 */
    Delete = 3,
    /** 忽略 */
    Ignore = 4
}

/** 聊天申请的状态 */
export enum ChatRequestStatus {
    /** 等待处理 */
    Wait = 0,
    /** 同意 */
    Agree = 1,
    /** 拒绝 */
    Reject = 2,
    /** 删除 */
    Delete = 3,
    /** 忽略 */
    Ignore = 4
}

/** 聊天室类型 */
export enum ChatroomType {
    /** 聊天室类型：群聊 */
    Group = 0,
    /** 聊天室类型：私聊 */
    Private = 1,
    /** 聊天室类型：单聊（就是自己跟自己聊） */
    Single = 2,
}

/** 聊天室成员角色 */
export enum ChatMemberRole {
    /** 成员角色：普通 */
    Normal = 0,
    /** 成员角色：管理 */
    Manage = 1,
    /** 成员角色：主人 */
    Host = 2
}

/** 枚举本地储存的KEY */
export enum LocalStorageKey {
    /** 聊天会话列表缓存 */
    ChatSessions = 'chat_sessions',
    /** 聊天富文本草稿 */
    ChatRichTextMap = 'chat_rich_text_map'
}

/** 枚举心情 */
export enum Mood {
    /** 喜 */
    Joy = 0,
    /** 怒 */
    Angry = 1,
    /** 哀 */
    Sorrow = 2,
    /** 乐 */
    Fun = 3,
}

/** 枚举性别 */
export enum Gender {
    /** 男性 */
    Male = 0,
    /** 女性 */
    Female = 1,
    /** 保密 */
    Secret = 2
}