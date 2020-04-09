/**
 * 唯一基础实体类
 */
export class Entity {
    id: number;
    createTime: number;
    updateTime: number;
}

/**
 * 聊天室
 */
export class Chatroom extends Entity {
    /** 聊天室名称 */
    name: string;
    /** 聊天室描述 */
    description: string;
    /** 聊天室头像 */
    avatar: string;
    /** 聊天室头像缩略图 */
    avatarThumbnail: string;
    /** 聊天室类型 */
    type: number;
}

/**
 * 聊天列表子项
 */
export class ChatItem extends Entity {
    /** 聊天室ID */
    chatroomId: number;
    /** 聊天室名称 */
    name: string;
    /** 未读消息数 */
    unread: number;
    /** 是否置顶 */
    sticky: boolean;
    /** 聊天室头像缩略图 */
    avatarThumbnail: string;
    /** 聊天室类型 */
    type: number;
    /** 最新消息 */
    latestMsg: MsgItem
}

/**
 * 消息列表子项
 */
export class MsgItem extends Entity {
    /** 消息对应的聊天室ID */
    chatroomId: number;
    /** 消息发送者ID */
    userId: number;
    /** 消息发送者的聊天室昵称 */
    nickname: string;
    /** 消息发送者的头像缩略图 */
    avatarThumbnail: string;
    /** 消息类型 */
    type: number;
    /** 消息内容 */
    content: string;
    /** 回复消息的消息记录ID */
    replyId: number;
}