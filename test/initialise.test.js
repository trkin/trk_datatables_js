const $ = require('jquery')
const trkDatatables = require('../src/index.js')(window, $)

const tableHtml = `
    <table data-datatable='true' id='myTable'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>MyName</td>
        </tr>
        <tr>
          <td>2</td>
          <td>YourName</td>
        </tr>
      </tbody>
    </table>`

test('initialise', () => {
  document.body.innerHTML = tableHtml
  trkDatatables.initialise()
  expect($('.dataTables_info').text()).toEqual('Showing 1 to 2 of 2 entries')
})

test('language passedOptions', () => {
  document.body.innerHTML = tableHtml
  let language = { "info": "Приказ _START_ до _END_ од укупно _TOTAL_ записа" }
  trkDatatables.initialise({ language: language })
  expect($('.dataTables_info').text()).toEqual('Приказ 1 до 2 од укупно 2 записа')
})
