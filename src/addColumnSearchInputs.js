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

  const addDateRangePicker = require('./addDateRangePicker')(window, $)
  const addColumnSearchInputs = ($table) => {
    $('thead th[data-searchable!="false"]', $table).each(function() {
      let $th = $(this)
      if ($table.data('datatableMultiselect')) {
        addMultiselect($th)
      } else {
        addInputBasedOnText($th)
        if ($(this).data('datatableRange')) {
          addDateRange($th)
        }
      }
    })
  }

  function addMultiselect($th){
    let text = $th.text()
    if (text.length > 0) {
      $th.data("original-text", text)
    }
    $th.html($th.data().datatableMultiselect)
    $('select', $th).multipleSelect({
      container: 'body',
      width: '110px',
      dropWidth: '150px',
      placeholder: text,
    })
    $('button', $th).on('click', (e) => {
      e.stopPropagation() // prevent reordering since it is on thead
    })
  }

  function addInputBasedOnText($th) {
    let text = $th.text()
    if (text.length == 0) return

    let klass = ''
    if (text == 'ID') {
      klass = 'trk-column-input__small'
    }
    $th.html(`<input class='trk-column-input ${klass}' type='text' placeholder='${text}' />`)
    $th.data("original-text", text)
    $('input', $th).on('click', (e) => {
      e.stopPropagation() // prevent reordering since it is on thead
    })
    if ($th.data('datatableSearchValue')) {
      $('input', $th).val($th.data('datatableSearchValue'))
    }
  }


  function addDateRange($th) {
    let $input = $('input', $th)
    $input.data('dateRange', $(this).data('datatableRange'))
    $input.data('predefinedRanges', $(this).data('datatablePredefinedRanges'))
    addDateRangePicker($input)
  }
  return addColumnSearchInputs
}))
