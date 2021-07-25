/**
 * 类方法节流装饰器
 * @param wait
 * @param field 定时器字段名
 */
export function Throttle(wait: number, field?: string) {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    field ??= `_${propertyKey}MethodThrottleTimer`;
    const fn = descriptor.value;

    descriptor.value = function () {
      this[field] && clearTimeout(this[field]);
      this[field] = window.setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    };
  }
}

/**
 * 类方法防抖装饰器
 * @param delay
 * @param field 定时器字段名
 */
export function Debounce(delay: number, field?: string) {
  return (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    field ??= `_${propertyKey}MethodDebounceTimer`;
    const fn = descriptor.value;

    descriptor.value = function () {
      this[field] ??= window.setTimeout(() => {
        fn.apply(this, arguments);
        this[field] = null;
      }, delay);
    };
  }
}
