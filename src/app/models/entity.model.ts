/**
 * 唯一基础实体类
 */
export class Entity {
    id: number;
    createTime: string;
    updateTime: string;
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
    /** 聊天室类型 */
    type: number;
}

export class ChatItem extends Entity {
    chatroomId: number;
    name: string;
    unread: number;
    sticky: boolean;
    avatar: string;
    type: number;
}