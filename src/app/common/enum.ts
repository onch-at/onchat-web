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

export enum SocketEvent {
    Connect    = 'connect',
    Disconnect = 'disconnect',
    Reconnect  = 'reconnect',
    Init       = 'init',
    Unload     = 'unload',
    Message    = 'message',
    UserJoin   = 'user_join',
    UserLeave  = 'user_leave'
}

export enum MessageType {
    TEXT = 1
}
