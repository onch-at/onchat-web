import { TestBed } from '@angular/core/testing';
import { NotificationController } from './notification.controller';

describe('NotificationController', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NotificationController = TestBed.get(NotificationController);
    expect(service).toBeTruthy();
  });
});
