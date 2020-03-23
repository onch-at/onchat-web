import { TestBed, async, inject } from '@angular/core/testing';

import { NotAuthGuard } from './not-auth.guard';

describe('NotAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotAuthGuard]
    });
  });

  it('should ...', inject([NotAuthGuard], (guard: NotAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
