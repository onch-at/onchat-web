import { TestBed } from '@angular/core/testing';
import { Rtc } from './rtc.service';

describe('Rtc', () => {
  let service: Rtc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rtc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
