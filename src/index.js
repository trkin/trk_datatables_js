// For CommonJS you can use:
// const trkDatatables = require('trk_datatables')(window, $)
// For AMD you can use:
// const trkDatatables = require('trk_datatables')
//
// Main function is:
// trkDatatables.initialise()
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
  // Sometime when I use: yarn link trk_datatables, than it will load another
  // jquery dependency and Invalidauthenticitytoken is fired. To fix this, you can:
  // $.ajaxPrefilter(function(options, originalOptions, xhr) {
  //   if (!options.crossDomain) {
  //     let token = $('meta[name="csrf-token"]').attr('content');
  //     if (token) xhr.setRequestHeader('X-CSRF-Token', token);
  //   }
  // });
  //
  // TODO: maybe we should move this require to iife
  // https://github.com/webpack-contrib/imports-loader
  // require("imports-loader?$=jquery!./example.js");
  // require('datatables.net?')(window, $)
  require('imports-loader?define=>false,this=>window!datatables.net')(window, $)
  require('imports-loader?define=>false,this=>window!datatables.net-bs4')(window, $)
  require('datatables.net-bs4/css/dataTables.bootstrap4.css')
  require('./main.sass')
  require('../fontello/css/fontello.css')

  const addColumnSearchInputs = require('./addColumnSearchInputs')(window, $)
  const addEventListeners = require('./addEventListeners')

  const initialise = (passedOptions = {}) => {
    $('[data-datatable]').each(function(){
      initialiseOne($(this), { passedOptions: passedOptions } )
    })
  }

  const initialiseOne = ($table, { isColumnSearch = undefined, passedOptions = {} }) => {
    // when we toggle collumnsearch we need to destroy before addColumnSearchInputs
    $table.DataTable().destroy()
    let options = findOptions($table, passedOptions)
    if (isColumnSearch === undefined) isColumnSearch = $('[data-datatable-search-value][data-datatable-search-value!=""]', $table).length
    if (isColumnSearch) {
      addColumnSearchInputs($table)
    } else {
      addLabels($table)
    }
    // here we actually initialise Datatable
    let datatable = $table.DataTable(options)
    if (isColumnSearch) addEventListeners(datatable, options)
    // **adjust** fix https://datatables.net/forums/discussion/43912
    setTimeout(function() { datatable.columns.adjust() }, 0)
    addIconGlobalSearch($table, isColumnSearch, passedOptions)
  }

  function findOptions($table, passedOptions) {
    let dom = $table.data('datatableDom') || '<"trk-global-search-wrapper"f>rtp<"trk-move-up"il>'
    let order = $table.data('datatableOrder') || [[0, 'desc']]
    let pageLength = $table.data('datatablePageLength') || 10
    let options = {
      // scrollY: "55vh", do not use Y scroll and show all items on a page
      scrollX: true, // this will introduce some misallignment between header and columns
      autoWidth: false, // with this option, body is full with but header stays original
      // so we need to use fix for **adjust** (note that if bootstrap styles is
      // loaded using spockets, header has 100% width)
      scrollCollapse: true,
      dom: dom,
      order: order,
      pageLength: pageLength,
      destroy: true, // this is needed when we enable/disable column search
    }
    let optionsAjax = {}
    if ($table.data('datatableAjaxUrl')) {
      let ajaxUrl = $table.data('datatableAjaxUrl')
      let totalLength = $table.data('datatableTotalLength')
      optionsAjax = {
        searchDelay: 500,
        processing: true,
        serverSide: true,
        deferLoading: totalLength,
        ajax: {
          url: ajaxUrl,
          type: 'POST',
          error: (xhr, message, error) => {
            let msg = `Ajax error. Please refresh the page. ${error}.`
            if (typeof xhr != 'undefined' && typeof xhr.responseJSON != 'undefined') {
              msg += ` ${xhr.responseJSON['error']}`
            }
            flash_alert(msg)
          },
        },
      }
    }
    let optionsColumnDefs = {}
    $('thead th', $table).each(function(index) {
      if ($(this).data('datatableHiddenColumn')) {
        if (!optionsColumnDefs["columnDefs"]) optionsColumnDefs["columnDefs"] = [{"targets": [], visible: false}]
        optionsColumnDefs["columnDefs"][0]['targets'].push(index)
      }
    })

    return {
      ...options,
      ...optionsAjax,
      ...optionsColumnDefs,
      ...passedOptions,
      language: {
        processing: `<i class="demo-icon icon-spinner fa-spin"
            style="font-size:24px"></i> Processing... spiner`,
        ...passedOptions.language,
        },
    }
  }

  function addLabels($table) {
    $('thead th', $table).each(function() {
      let original_text = $(this).data('original-text')
      if (original_text)
        $(this).html(original_text)
    })
  }

  function addIconGlobalSearch($table, isColumnSearch, passedOptions) {
    let icon = isColumnSearch ? 'trk-icon-table' : 'trk-icon-grid'
    $('.trk-global-search-wrapper label').append(`<div class='trk-global-search-icon-wrapper'><button class='trk-global-search-button'><i class='demo-icon ${icon}' aria-hidden='true'></i></button></div>`)
    $('.trk-global-search-icon-wrapper').click(function() {
      if (isColumnSearch) {
        initialiseOne($table, { isColumnSearch: false, passedOptions: passedOptions })
      } else {
        initialiseOne($table, { isColumnSearch: true, passedOptions: passedOptions })
      }
    })
  }

  function flash_alert(msg) {
    alert(msg)
  }

  return {
    initialise
  }
  // module.exports = { initialise }
}))
