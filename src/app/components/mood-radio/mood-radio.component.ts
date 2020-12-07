import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Mood } from 'src/app/common/enum';

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
export class MoodRadioComponent implements OnInit, ControlValueAccessor {
  private _value: Mood;

  set value(value: Mood) {
    this._value = value;
    this.onValueChange(value);
  }

  get value(): Mood {
    return this._value;
  }

  mood: typeof Mood = Mood;

  constructor() { }

  private onValueChange(value: Mood) { }

  ngOnInit() { }

  writeValue(value: Mood): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this.onValueChange = fn;
  }

  registerOnTouched(fn: any): void { }
}
