export class CssUtil {
  private static pixel: number;
  private static sizeMap: Map<string, number> = new Map<string, number>();

  /**
   * rem 转 px
   * @param rem
   */
  static rem2px(rem: number): number {
    if (!CssUtil.pixel) {
      const div = document.createElement('div');
      div.style.height = '1rem';
      document.body.appendChild(div);
      CssUtil.pixel = div.offsetHeight || parseFloat(window.getComputedStyle(document.documentElement).getPropertyValue('font-size'));
      document.body.removeChild(div);
    }

    return rem * CssUtil.pixel;
  }

  /**
   * 将一些 CSS size expression 转为 px
   * @param size
   */
  static size(size: string): number {
    if (!CssUtil.sizeMap.has(size)) {
      const div = document.createElement('div');
      div.style.height = size;
      document.body.appendChild(div);
      CssUtil.sizeMap.set(size, div.offsetHeight);
      document.body.removeChild(div);
    }

    return CssUtil.sizeMap.get(size);
  }
}