import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string, type: 'html' | 'style' | 'script' | 'url'): unknown {
    return {
      'html': this.sanitizer.bypassSecurityTrustHtml(value),
      'style': this.sanitizer.bypassSecurityTrustStyle(value),
      'script': this.sanitizer.bypassSecurityTrustScript(value),
      'url': this.sanitizer.bypassSecurityTrustUrl(value),
    }[type];
  }

}
