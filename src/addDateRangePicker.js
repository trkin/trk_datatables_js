(function( factory ) {
  "use strict";
  if ( typeof exports === 'object' ) {
    // CommonJS
    module.exports = function (root, $) {
      if ( ! root ) {
        // CommonJS environments without a window global must pass a
        // root. This will give an error otherwise
        root = window;
      }

      if ( ! $ ) {
        $ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
          require('jquery') :
          require('jquery')( root );
      }

      return factory( $, root, root.document );
    };
  }
  else {
    // Browser
    factory( jQuery, window, document );
  }
}(function( $, window, document, undefined ) { // eslint-disable-line
  "use strict";

  // let moment = require('moment')()
  // require('daterangepicker')(moment, $)
  require('./vendor/daterangepicker')(undefined, $)
  require('daterangepicker/daterangepicker.css')

  const addDateRangePicker = function($input) {
    // http://www.daterangepicker.com/#options
    let format = 'DD-MMM-YYYY'
    let timePicker = false
    if ($input.data("dateRange") == "datetime") {
      format = 'DD-MMM-YYYY h:mm A'
      timePicker = true
    }
    let ranges = []
    let showCustomRangeLabel = false
    if ($input.data("predefinedRanges")) {
      ranges = $input.data("predefinedRanges")
      showCustomRangeLabel = true
    }
    $input.daterangepicker({
      autoApply: true,
      timePicker: timePicker,
      locale: {
        format: format,
      },
      ranges: ranges,
      showCustomRangeLabel: showCustomRangeLabel,
      opens: 'left',
      autoUpdateInput: false, // we need to disable since it will use todays value,
      // we want initially empty (so we populate on events)
    }).on('apply.daterangepicker', (ev, picker) => $input.val(picker.startDate.format(format) + ' - ' +
                         picker.endDate.format(format)).change()
    )
  } // const addDateRangePicker = function($input) {

  return addDateRangePicker
}))
