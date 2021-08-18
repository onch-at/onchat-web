import { TestBed } from '@angular/core/testing';
import { Application } from './app.service';


describe('Application', () => {
  let service: Application;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Application);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
