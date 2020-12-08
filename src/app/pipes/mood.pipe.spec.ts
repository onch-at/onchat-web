import { MoodPipe } from './mood.pipe';

describe('MoodPipe', () => {
  it('create an instance', () => {
    const pipe = new MoodPipe();
    expect(pipe).toBeTruthy();
  });
});
