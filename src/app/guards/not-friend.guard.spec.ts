import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { NotFriendGuard } from './not-friend.guard';

describe('NotFriendGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotFriendGuard]
    });
  });

  it('should ...', inject([NotFriendGuard], (guard: NotFriendGuard) => {
    expect(guard).toBeTruthy();
  }));
});
