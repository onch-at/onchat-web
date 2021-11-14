import { TestBed } from '@angular/core/testing';
import { Peer } from './peer.service';

describe('Peer', () => {
  let service: Peer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Peer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
