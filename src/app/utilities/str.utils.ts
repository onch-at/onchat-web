export class StrUtils {
  /**
   * 剔除字符串中所有空格及换行
   * @param str
   */
  static trimAll(str: string): string {
    return str.replace(/[\s\n]+/g, '');
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

  /**
   * 生成随机字符串
   */
  static random(): string {
    return btoa(performance.now().toString());
  }
}