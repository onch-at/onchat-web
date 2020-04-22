export class StrUtil {
    /**
     * 剔除字符串中所有空格
     * @param str 
     */
    static trimAll(str: string): string {
        return str.replace(/\s+/g, '');
    }

    /**
     * 将字符串中的超链接转为A标签
     * @param str 
     */
    static hyperlink(str: string): string {
        return str.replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g, '<a href="$1$2" a="1" target="_blank">$1$2</a>')
    }
}