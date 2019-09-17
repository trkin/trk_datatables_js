const $ = require('jquery')
const trkDatatables = require('../src/index.js')(window, $)

test('initialise', () => {
  document.body.innerHTML = `
  <div id='m'>a</div>
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
  trkDatatables.initialise()
  expect($('.dataTables_info').text()).toEqual('Showing 1 to 2 of 2 entries')
})
