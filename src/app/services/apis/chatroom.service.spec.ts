import { TestBed } from '@angular/core/testing';

import { ChatroomService } from './chatroom.service';

describe('ChatroomService', () => {
  let service: ChatroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
