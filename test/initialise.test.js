const trkDatatables = require('../src/index.js')
test('pass', () => {
  expect(true).toBe(true)
})
test('returns 5', () => {
  expect(trkDatatables.initialise()).toBe(5)
})
