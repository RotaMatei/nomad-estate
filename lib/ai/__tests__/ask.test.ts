import { readEvents } from '../ask';

describe('reading a streamed answer', () => {
  it('splits complete events and keeps the unfinished one for later', () => {
    const { events, rest } = readEvents('event: sources\ndata: [{"number":1}]\n\nevent: text\ndata: {"delta":"The rate"}\n\nevent: text\ndata: {"del');
    expect(events).toEqual([
      { event: 'sources', data: '[{"number":1}]' },
      { event: 'text', data: '{"delta":"The rate"}' },
    ]);
    expect(rest).toBe('event: text\ndata: {"del');
  });

  it('ignores keep-alive comments and reads Windows line ends', () => {
    const { events, rest } = readEvents(': keep-alive\r\n\r\nevent: done\r\ndata: {"outcome":"no_source"}\r\n\r\n');
    expect(events).toEqual([{ event: 'done', data: '{"outcome":"no_source"}' }]);
    expect(rest).toBe('');
  });
});
