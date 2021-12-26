import { CdkVirtualForOf } from '@angular/cdk/scrolling';
import { NgForOf } from '@angular/common';
import { Directive, Host, Optional } from '@angular/core';

@Directive({
  selector: '[ngForTrackById], [cdkVirtualForTrackById]',
})
export class ForTrackByIdDirective<T extends { id: number | string }> {
  constructor(
    @Host() @Optional() private ngForOf: NgForOf<T>,
    @Host() @Optional() private cdkForOf: CdkVirtualForOf<T>,
  ) {
    if (this.ngForOf) {
      this.ngForOf.ngForTrackBy = (_index: number, item: T) => item.id;
    } else if (this.cdkForOf) {
      this.cdkForOf.cdkVirtualForTrackBy = (_index: number, item: T) => item.id;
    }
  }
}
