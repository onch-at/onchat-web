/**
 * 用户名正则表达式：字母/数字/中文/下划线/横杠
 * https://mothereff.in/regexpu#input=const+regex+=+/%5Cp%7BUnified_Ideograph%7D/u;&unicodePropertyEscape=1
 */
export const USERNAME_PATTERN = /^([a-z]|[A-Z]|[0-9]|_|-|[\u3400-\u4DBF\u4E00-\u9FFC\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\u{20000}-\u{2A6DD}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{30000}-\u{3134A}])+$/u;
