import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  msg: HTMLAudioElement = new Audio('/assets/audio/boo.mp3');

  constructor() { }
}
