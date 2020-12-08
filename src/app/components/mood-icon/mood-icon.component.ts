import { Component, Input, OnInit } from '@angular/core';
import { Mood } from 'src/app/common/enum';

@Component({
  selector: 'app-mood-icon',
  templateUrl: './mood-icon.component.html',
  styleUrls: ['./mood-icon.component.scss'],
})
export class MoodIconComponent implements OnInit {
  @Input() value: Mood;

  constructor() { }

  ngOnInit() { }

  src() {
    return '/assets/svg/mood/' + {
      [Mood.Joy]: 'joy',
      [Mood.Angry]: 'angry',
      [Mood.Sorrow]: 'sorrow',
      [Mood.Fun]: 'fun',
    }[this.value] + '.svg'
  }

  color() {
    return {
      [Mood.Joy]: 'var(--oc-color-primary)',
      [Mood.Angry]: 'var(--oc-color-danger)',
      [Mood.Sorrow]: 'var(--oc-color-info)',
      [Mood.Fun]: 'var(--oc-color-primary)',
    }[this.value];
  }

}
