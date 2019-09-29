# Trk Datatables

This is complete package that depends on [datatables](https://datatables.net)
and works with [trk_datatables gem](https://datatables.net)

## Installation with webpack

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

Also you need to include styles from js

```
// app/views/layouts/application.html.erb
    <%= stylesheet_pack_tag 'application', 'data-turbolinks-track': 'reload' %>
```

## Instalattion with script tag

Look for example `test/support/server_side.html` and run `yarn build` to
generate `dist/index.js`.

```
<!-- test/support/server_side.html -->
    <script type="text/javascript" src="./../../dist/index.js"></script>
    <table data-datatable='true' data-datatable-ajax-url='http://localhost:3004/clubs/search.json' id='myTable'>
    </table>
    <script>
      trkDatatables(window, $).initialise()
    </script>
```

## Development

To run test you can
```
# run all test files
yarn test

# run single
node node_modules/.bin/jest --runInBand test/initialise.test.js
```

You can open sample with
```
yarn start
# open examples in dist
gnome-open http://localhost:8081/dist/client_side.html
gnome-open http://localhost:8081/dist/server_side.html
```

To test on a project localy
```
# in package folder
yarn link

# in usage folder
# eventual remove from package and node_modules
yarn remove trk_datatables
yarn link trk_datatables

# when you are done, you should use npm version, not local
yarn unlink trk_datatables
yarn add trk_datatables
```

For icons we used http://fontello.com/ `npm install fontello-cli -g` and open a
page:

```
fontello-cli --config fontello/config.json open
```

You can download package and extract to `/fontello` or you can download
`config.json` and copy and install (in this case it will not update demo.html)

```
cp ~/Downloads/config.json fontello/
fontello-cli --config fontello/config.json install
```

To see local previews you can also
```
gnome-open fontello/demo.html
```

## Deploy

Release new version by updating `version` in package.json and
```
npm publish
```
