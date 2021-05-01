import { TestBed } from '@angular/core/testing';
import { Recorder } from './recorder.service';

describe('Recorder', () => {
  let service: Recorder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Recorder);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
