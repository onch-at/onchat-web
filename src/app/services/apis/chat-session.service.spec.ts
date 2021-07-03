import { TestBed } from '@angular/core/testing';

import { ChatSessionService } from './chat-session.service';

describe('ChatSessionService', () => {
  let service: ChatSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
