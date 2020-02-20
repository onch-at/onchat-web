import { TestBed } from '@angular/core/testing';

import { OnChatService } from './onchat.service';

describe('OnChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnChatService = TestBed.get(OnChatService);
    expect(service).toBeTruthy();
  });
});
