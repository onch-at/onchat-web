import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitize'
})
export class SanitizePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string, type: 'html' | 'style' | 'script' | 'url' | 'res'): string {
    const context = {
      'res': SecurityContext.RESOURCE_URL,
      'url': SecurityContext.URL,
      'html': SecurityContext.HTML,
      'style': SecurityContext.STYLE,
      'script': SecurityContext.SCRIPT
    }[type];

    return this.sanitizer.sanitize(context, value);
  }

}
