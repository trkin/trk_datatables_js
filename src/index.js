// We need IIFE since we add datatables plugin to existing jQuery object which
// can be done for example with:
// const trkDatatables = require('trk_datatables')(window, $)
// trkDatatables.initialise()
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

  // TODO: maybe we should move this require to iife
  require('datatables.net')(window, $)
  require('datatables.net-bs4')(window, $)
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
    addIconGlobalSearch($table, isColumnSearch, passedOptions)
  }

  function findOptions($table, passedOptions) {
    let dom = $table.data('datatableDom') || '<"trk-global-search-wrapper"f>rtp<"trk-move-up"il>'
    let order = $table.data('datatableOrder') || [[0, 'desc']]
    let pageLength = $table.data('datatablePageLength') || 10
    let options = {
      // scrollY: "55vh", do not use Y scroll and show all items on a page
      scrollX: true,
      scrollCollapse: true,
      autoWidth: false,
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
