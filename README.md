# Trk Datatables

This is complete package that depends on [datatables](https://datatables.net)
and works with [trk_datatables gem](https://datatables.net)

## Installation

```
yarn add trk_datatables
```


Add to your page load or turbolinks load if you are using Rails and webpacker

```
// app/javascripts/turbolinks.load.js
const trkDatatables = require('trk_datatables')

document.addEventListener('turbolinks:load', () => {
  // this will initialise all data-datatables elements
  trkDatatables.initialise()
})
```
