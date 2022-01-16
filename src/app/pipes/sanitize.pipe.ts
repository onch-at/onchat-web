import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser';

@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string, type: 'html' | 'style' | 'script' | 'url' | 'res'): SafeValue {
    switch (type) {
      case 'res':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);

      case 'url':
        return this.sanitizer.bypassSecurityTrustUrl(value);

      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);

      case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);

      case 'script':
        return this.sanitizer.bypassSecurityTrustScript(value);
    }
  }

}
