import { Pipe, PipeTransform } from '@angular/core';
import { Mood } from '../common/enums';

@Pipe({
  name: 'mood'
})
export class MoodPipe implements PipeTransform {

  transform(value: Mood): string {
    return {
      [Mood.Joy]: '喜',
      [Mood.Angry]: '怒',
      [Mood.Sorrow]: '哀',
      [Mood.Fun]: '乐'
    }[value];
  }

}
