// Basit backend test örneği
function sum(a, b) { return a + b; }
test('sum adds numbers', () => {
  expect(sum(2, 2)).toBe(4);
});
