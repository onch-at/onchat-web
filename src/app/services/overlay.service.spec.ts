import { TestBed } from '@angular/core/testing';
import { Overlay } from './overlay.service';


describe('Overlay', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Overlay = TestBed.get(Overlay);
    expect(service).toBeTruthy();
  });
});
