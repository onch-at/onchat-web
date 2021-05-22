import { TestBed } from '@angular/core/testing';
import { RouterAnimation } from './router-animation.service';


describe('RouterAnimationService', () => {
  let service: RouterAnimation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouterAnimation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
