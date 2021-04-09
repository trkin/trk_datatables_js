# Trk Datatables

This is javascript package that depends on [datatables](https://datatables.net)
and works with [trk_datatables gem](https://github.com/trkin/trk_datatables)

Here is example demo Rails application [https://github.com/trkin/trk_datatables_demo ](https://github.com/trkin/trk_datatables_demo)

This package is using following npm packages:

* datarangepicker https://github.com/dangrossman/daterangepicker
* multiple-select https://github.com/wenzhixin/multiple-select
* tristate https://github.com/vanderlee/tristate

## Installation on Ruby on Rails with webpack

Find on
[https://github.com/trkin/trk_datatables#installation ](https://github.com/trkin/trk_datatables#installation)

Somehow it needs provided jquery plugin even it does not load another instance
of jquery (note that when you use `yarn link trk_datatables` it loads two
jqueries so do not assume that `yarn link` is the same as node_modules).

```
config/webpack/environment.js
const { environment } = require('@rails/webpacker')
const webpack = require('webpack');
environment.plugins.append('Provide', new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery',
  Popper: ['popper.js', 'default']
}));

module.exports = environment
```

## Installation with script tag

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

# Options

You can search for `passedOptions` to see which parameters you can change:

* language
* dateRangePickerDateFormat and dateRangePickerDateTimeFormat

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

To test on a project locally
```
# in this folder (trk_datatables package folder)
yarn link

# to see links
ls -la ~/.config/yarn/link

# in usage folder (rails folder)
rm -rf node_modules/trk_datatables
yarn link trk_datatables
# this will create link node_modules/trk_datatables ->
# ../../../.config/yarn/link/trk_datatables which points to
# ~/javascript/trk_datatables

# when you are done, you should use npm version, not local
yarn unlink trk_datatables
yarn add trk_datatables
```

Also to debug on Rails app, you can put `debugger` here in `src/index.js` and
change (simply add new line) `app/javascript/packs/application.js` to triger
webpack rebuild.

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

Release new version by updating `version` in package.json and push
```
npm publish
```
