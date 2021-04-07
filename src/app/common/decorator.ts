/**
 * 类方法节流装饰器
 * @param wait
 */
export function Throttle(wait: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let timer: number = null;
    const fn = descriptor.value;

    descriptor.value = function () {
      timer && clearTimeout(timer);
      timer = window.setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    };
  }
}

/**
 * 类方法防抖装饰器
 * @param delay
 */
export function Debounce(delay: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let timer: number = null;
    const fn = descriptor.value;

    descriptor.value = function () {
      timer === null && (timer = window.setTimeout(() => {
        fn.apply(this, arguments);
        timer = null;
      }, delay));
    };
  }
}
