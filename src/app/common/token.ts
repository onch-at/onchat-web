import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('WindowToken', {
  factory: () => inject(DOCUMENT).defaultView,
});

export const LOCATION = new InjectionToken<Location>('LocationToken', {
  factory: () => inject(DOCUMENT).location,
});

export const NAVIGATOR = new InjectionToken<Navigator>('NavigatorToken', {
  factory: () => inject(WINDOW).navigator,
});

export const STORAGE = new InjectionToken<Storage>('StorageToken', {
  factory: () => inject(WINDOW).localStorage,
});
