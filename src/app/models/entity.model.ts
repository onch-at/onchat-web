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
    /** 聊天室类型 */
    type: number;
}