import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-constellation-icon',
  templateUrl: './constellation-icon.component.html',
  styleUrls: ['./constellation-icon.component.scss'],
})
export class ConstellationIconComponent {
  @Input() value: number;

  get className() {
    return 'icon-constellation-' + {
      1: 'aquarius',
      2: 'pisces',
      3: 'aries',
      4: 'taurus',
      5: 'gemini',
      6: 'cancer',
      7: 'leo',
      8: 'virgo',
      9: 'libra',
      10: 'scorpio',
      11: 'sagittarius',
      12: 'capricorn',
    }[this.value];
  }

  constructor() { }

}
