import { TestBed } from '@angular/core/testing';
import { MediaDevice } from './media-device.service';

describe('MediaDevice', () => {
  let service: MediaDevice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaDevice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
