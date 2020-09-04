/** 浮层通知组件参数 */
export interface NotificationOptions {
    /** 标题 */
    title: string;
    /** 描述 */
    description?: string;
    /** 图标URL */
    iconUrl?: string;
    /** 持续时间 */
    duration?: number;
    /** 点击事件处理 */
    tapHandler?: (event: Event) => void;
}

/** 警告框组件参数 */
export interface AlertOptions {
    /** 标头 */
    header: string;
    /** 文字 */
    message?: string;
    /** 确认时的回调函数 */
    confirmHandler: CallableFunction;
    /** 取消时的回调函数 */
    cancelHandler?: CallableFunction
    /** 输入组 */
    inputs?: any[];
}