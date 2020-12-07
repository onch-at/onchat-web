import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'constellation'
})
export class ConstellationPipe implements PipeTransform {

  transform(value: number): string {
    const constellations = [
      '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座',
      '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座'
    ];

    return constellations[value];
  }

}
