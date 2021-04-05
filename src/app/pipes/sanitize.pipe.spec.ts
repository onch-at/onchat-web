import { SanitizePipe } from './sanitize.pipe';

describe('SanitizePipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizePipe();
    expect(pipe).toBeTruthy();
  });
});
