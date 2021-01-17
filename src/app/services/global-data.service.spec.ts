import { TestBed } from '@angular/core/testing';
import { GlobalData } from './global-data.service';


describe('GlobalData', () => {
  let service: GlobalData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
