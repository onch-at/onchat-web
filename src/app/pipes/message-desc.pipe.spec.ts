import { MessageDescPipe } from './message-desc.pipe';

describe('MessageDescPipe', () => {
  it('create an instance', () => {
    const pipe = new MessageDescPipe();
    expect(pipe).toBeTruthy();
  });
});
