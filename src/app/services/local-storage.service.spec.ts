import { TestBed } from '@angular/core/testing';
import { LocalStorage } from './local-storage.service';


describe('LocalStorage', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalStorage = TestBed.get(LocalStorage);
    expect(service).toBeTruthy();
  });
});
