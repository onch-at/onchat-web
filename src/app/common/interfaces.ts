import { ValidationErrors } from '@angular/forms';
import { AlertButton, AlertInput } from '@ionic/angular';
import { ChatSession } from '../models/onchat.model';

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
  handler?: (event: Event) => unknown;
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
  confirmHandler?: AlertButton['handler'];
  /** 取消时的回调函数 */
  cancelHandler?: AlertButton['handler'];
  /** 输入组 */
  inputs?: AlertInput[];
}
