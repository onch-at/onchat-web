/**
 * 枚举周
 */
export enum WeekDay {
    Sunday    = '周日',
    Monday    = '周一',
    Tuesday   = '周二',
    Wednesday = '周三',
    Thursday  = '周四',
    Friday    = '周五',
    Saturday  = '周六',
}

/**
 * 枚举天
 */
export enum Day {
    TODAY     = '今天',
    YESTERDAY = '昨天'
}

/**
 * 枚举Socket事件
 */
export enum SocketEvent {
    /** 连接打通时 */
    Connect    = 'connect',
    /** 连接断开时 */
    Disconnect = 'disconnect',
    /** 重新连接时 */
    Reconnect  = 'reconnect',
    /** 初始化 */
    Init       = 'init',
    /** 卸载时 */
    Unload     = 'unload',
    /** 接收到消息时 */
    Message    = 'message',
    /** 收到撤回消息 */
    RevokeMsg  = 'revoke_msg',
    /** 加入房间 */
    JoinRoom   = 'join_room',
    /** 退出房间 */
    LeaveRoom  = 'leave_room'
}

/**
 * 枚举消息类型
 */
export enum MessageType {
    /** 系统消息 */
    System = 0,
    /** 文本 */
    Text   = 1,
    Tips   = 2
}
