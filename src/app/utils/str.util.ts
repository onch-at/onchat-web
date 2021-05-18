export class StrUtil {
  /**
   * 剔除字符串中所有空格及换行
   * @param str
   */
  static trimAll(str: string): string {
    return str.replace(/[\s\n]+/g, '');
  }

  // TODO: 等typescript版本升上来就可以移除掉该方法了
  /**
   * 剔除字符串末尾的空格及换行
   * @param str
   */
  static trimEnd(str: string): string {
    return str.replace(/[\s\n]+$/, '');
  }

  /**
   * 是否为字符串
   * @param obj
   */
  static isString(obj: unknown) {
    return obj.constructor === String;
  }

  /**
   * 将特殊字符转换为HTML实体
   * @param str
   */
  static html(str: string): string {
    const element = document.createElement('div');
    element.textContent = str;

    return element.innerHTML;
  }
}