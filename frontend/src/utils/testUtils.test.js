import { sum } from './testUtils';

test('sum utility adds numbers', () => {
  expect(sum(2, 3)).toBe(5);
});
