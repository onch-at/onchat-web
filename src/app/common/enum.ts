/**
 * 枚举周
 */
export enum WeekDay {
    Sunday = '周日',
    Monday = '周一',
    Tuesday = '周二',
    Wednesday = '周三',
    Thursday = '周四',
    Friday = '周五',
    Saturday = '周六',
}

/**
 * 枚举天
 */
export enum Day {
    Today = '今天',
    Yesterday = '昨天'
}

/**
 * 枚举Socket事件
 */
export enum SocketEvent {
    /** 连接打通时 */
    Connect = 'connect',
    /** 连接断开时 */
    Disconnect = 'disconnect',
    /** 重新连接时 */
    Reconnect = 'reconnect',
    /** 连接失败时 */
    ConnectError = 'connect_error',
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
    FriendRequestReject = 'friend_request_reject'
}

/**
 * 枚举消息类型
 */
export enum MessageType {
    /** 系统消息 */
    System = 0,
    /** 文本 */
    Text = 1,
    /** 富文本 */
    RichText = 2,
    Tips = 3,
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

/** 聊天室类型 */
export enum ChatroomType {
    /** 聊天室类型：群聊 */
    Group = 0,
    /** 聊天室类型：私聊 */
    Private = 1,
    /** 聊天室类型：单聊（就是自己跟自己聊） */
    Single = 2,
}

/**
 * 枚举本地储存的KEY
 */
export enum LocalStorageKey {
    /** 聊天会话列表缓存 */
    ChatList = 'chat_list',
    /** 聊天富文本草稿 */
    ChatRichTextMap = 'chat_rich_text_map'
}

/**
 * 枚举会话储存的KEY
 */
export enum SessionStorageKey {
    /** 用户Map缓存 */
    UserMap = 'user_map'
}