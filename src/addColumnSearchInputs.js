(function( factory ) {
  "use strict";
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( ['jquery'], function ( $ ) {
      return factory( $, window, document );
    } );
  }
  else if ( typeof exports === 'object' ) {
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

  const addDateRangePicker = require('./addDateRangePicker')
  require('tristate/jquery.tristate.js')

  const addColumnSearchInputs = ($table) => {
    $('thead th[data-searchable!="false"]', $table).each(function() {
      let $th = $(this)
      if ($th.data('datatableMultiselect')) {
        addMultiselect($th)
      } else if ($th.data('datatableCheckbox')) {
        addCheckbox($th)
      } else {
        addInputBasedOnText($th)
        if ($th.data('datatableRange')) {
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

  function _titleize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  function _outputFunc(id) {
    return function(state, value) {
      return $("#" + id).text(_titleize(value))
    }
  }

  function addCheckbox($th){
    let text = $th.text();
    if (text.length > 0) {
      $th.data("original-text", text)
    }
    let initialValue;
    if (typeof $th.data().datatableSearchValue !== 'undefined') {
      if ($th.data().datatableSearchValue === true) {
        initialValue = 'checked="checked"'
      } else if ($th.data().datatableSearchValue === false) {
        initialValue = ''
      }
    } else {
      initialValue = "indeterminate='1'"
    }
    let id = Math.random().toString(36).substr(2, 9)
    $th.html(`
      <label for='${id}' class='trk-column-checkbox'>
        ${text}
        <input id='${id}' type='checkbox' ${initialValue} />
        <span id='${id}-output'></span>
      </label>
    `)
    $(`#${id}`).tristate({
      checked: 'true',
      unchecked: 'false',
      indeterminate: 'any',
      init: _outputFunc(`${id}-output`),
      change: _outputFunc(`${id}-output`)
    });
    return $('label', $th).on('click', function(e) {
      return e.stopPropagation()
    })
  }

  function addInputBasedOnText($th) {
    let text = $th.text()
    if (text.length == 0) return

    let klass = ''
    if (text.toUpperCase() == 'ID') {
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
