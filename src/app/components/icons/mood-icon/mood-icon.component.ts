import { Component, Input } from '@angular/core';
import { Mood } from 'src/app/common/enum';

@Component({
  selector: 'app-mood-icon',
  templateUrl: './mood-icon.component.html',
  styleUrls: ['./mood-icon.component.scss'],
})
export class MoodIconComponent {
  @Input() value: Mood;

  src = () => ('/assets/svg/mood/' + {
    [Mood.Joy]: 'joy',
    [Mood.Angry]: 'angry',
    [Mood.Sorrow]: 'sorrow',
    [Mood.Fun]: 'fun',
  }[this.value] + '.svg');

  color = () => ({
    [Mood.Joy]: 'var(--color-primary)',
    [Mood.Angry]: 'var(--color-danger)',
    [Mood.Sorrow]: 'var(--color-info)',
    [Mood.Fun]: '#fa541c',
  }[this.value]);

  constructor() { }

}
