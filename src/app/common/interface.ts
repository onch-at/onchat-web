import { KeyValue } from "@angular/common";

/** 浮层通知组件参数 */
export interface NotificationOptions {
    /** 标题 */
    title: string;
    /** 描述 */
    description?: string;
    /** 图标URL */
    icon?: string;
    /** 持续时间 */
    duration?: number;
    /** 点击通知跳转页面 */
    url?: string;
    /** 点击事件处理 */
    handler?: (event: Event) => void;
}

/** 警告框组件参数 */
export interface AlertOptions {
    /** 标头 */
    header: string;
    /** 文字 */
    message?: string;
    /** 点击背景关闭 */
    backdropDismiss?: boolean;
    /** 确认时的回调函数 */
    confirmHandler: (data?: KeyValue<string, any>) => any;
    /** 取消时的回调函数 */
    cancelHandler?: (data?: KeyValue<string, any>) => any
    /** 输入组 */
    inputs?: any[];
}
