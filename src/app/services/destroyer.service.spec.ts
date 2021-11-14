import { TestBed } from '@angular/core/testing';
import { Destroyer } from './destroyer.service';

describe('Destroyer', () => {
  let service: Destroyer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Destroyer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
