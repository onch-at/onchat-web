import { KeyValue } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import { ChatSession } from '../models/onchat.model';

/** 组件引用 */
type ComponentRef = Function | HTMLElement | string | null;
/** 组件参数 */
type ComponentProps<T = null> = { [key: string]: any };

/** 聊天会话多选框类型 */
export type ChatSessionCheckbox = ChatSession & { checked: boolean };

/** 验证反馈 */
export type ValidationFeedback = (errors: ValidationErrors) => string;

/** 浮层通知组件选项 */
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

/** 警告框组件选项 */
export interface AlertOptions {
  /** 标头 */
  header: string;
  /** 文字 */
  message?: string;
  /** 点击背景关闭 */
  backdropDismiss?: boolean;
  /** 确认按钮的文字 */
  confirmText?: string;
  /** 取消按钮的文字 */
  cancelText?: string;
  /** 确认时的回调函数 */
  confirmHandler?: (data?: KeyValue<string, any>) => any;
  /** 取消时的回调函数 */
  cancelHandler?: (data?: KeyValue<string, any>) => any;
  /** 输入组 */
  inputs?: any[];
}

/**
 * 摘录至：
 * @link https://github.com/ionic-team/ionic-framework/blob/master/core/src/components/action-sheet/action-sheet-interface.ts
 */
export interface ActionSheetButton {
  /** 文字 */
  text?: string;
  /** 按钮角色 */
  role?: 'cancel' | 'destructive' | 'selected' | string;
  /** 图标 */
  icon?: string;
  /** CSS Class */
  cssClass?: string | string[];
  /** 点击处理器 */
  handler?: () => any;
}

/** 模态框组件选项 */
export interface ModalOptions<T extends ComponentRef = ComponentRef> {
  /** 组件 */
  component: T;
  /** 组件参数 */
  componentProps?: ComponentProps;
  /** 点击背景关闭 */
  backdropDismiss?: boolean;
  /** CSS Class */
  cssClass?: string | string[];
  swipeToClose?: boolean;
  presentingElement?: HTMLElement;
}

/** 弹出框组件选项 */
export interface PopoverOptions<T extends ComponentRef = ComponentRef> {
  /** 组件 */
  component: T;
  /** 组件参数 */
  componentProps?: ComponentProps<T>;
  /** 展示背景 */
  showBackdrop?: boolean;
  /** 点击背景关闭 */
  backdropDismiss?: boolean;
  /** CSS Class */
  cssClass?: string | string[];
  /** 触发源事件 */
  event?: Event;
  /** 关闭键盘 */
  keyboardClose?: boolean;
}
