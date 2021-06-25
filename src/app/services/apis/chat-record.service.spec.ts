import { TestBed } from '@angular/core/testing';

import { ChatRecordService } from './chat-record.service';

describe('ChatRecordService', () => {
  let service: ChatRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
