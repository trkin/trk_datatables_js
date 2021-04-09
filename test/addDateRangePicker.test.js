const $ = require('jquery')
const addDateRangePicker = require('../src/addDateRangePicker.js')(window, $)

test('addDateRangePicker', () => {
  document.body.innerHTML = `
    <input id='my-input' data-range='true'>
  `
  let $input = $('my-input')
  addDateRangePicker($input, {})
})
