import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Mood } from 'src/app/common/enum';
import { SafeAny } from 'src/app/common/interface';

@Component({
  selector: 'app-mood-radio',
  templateUrl: './mood-radio.component.html',
  styleUrls: ['./mood-radio.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MoodRadioComponent),
    multi: true
  }]
})
export class MoodRadioComponent implements ControlValueAccessor {
  private _value: Mood;

  set value(value: Mood) {
    this._value = value;
    this.onValueChange(value);
  }

  get value(): Mood {
    return this._value;
  }

  readonly mood: typeof Mood = Mood;

  constructor() { }

  private onValueChange(value: Mood) { }

  writeValue(value: Mood): void {
    this._value = value;
  }

  registerOnChange(fn: SafeAny): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: SafeAny): void { }
}
