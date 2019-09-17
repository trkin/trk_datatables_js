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
}
(function( $, window, document, undefined ) {
  "use strict";

  // TODO: maybe we should move this require to iife
  require('datatables.net')(window, $)
  require('datatables.net-bs4')(window, $)
  require('datatables.net-bs4/css/dataTables.bootstrap4.css')
  require('./index.sass')

  const columnSearchInputs = require('./column_search_inputs')

  const initialise = () => {
    $('[data-datatable]').each(function(){
      let $table = $(this)
      let options = findOptions($table)
      columnSearchInputs($table)
      $table.DataTable().destroy()
      $table.DataTable(options)
    })
  }

  function findOptions($table) {
    let dom = $table.data('datatableDom') || "TODO: <defualt>";
    let order = $table.data('datatableOrder') || [[0, 'desc']]
    let pageLength = $table.data('datatablePageLength') || 10
    let options = {
      // scrollY: "55vh", do not use Y scroll and show all items on a page
      scrollX: true,
      scrollCollapse: true,
      autoWidth: false,
      // dom: dom,
      order: order,
      pageLength: pageLength,
      destroy: true, // this is needed when we enable/disable column search
    }
    let ajaxOptions = {}
    if ($table.data('datatableAjaxUrl')) {
      let ajaxUrl = $table.data('datatableAjaxUrl')
      let totalLength = $table.data('datatableTotalLength')
      ajaxOptions = {
        searchDelay: 500,
        processing: true,
        oLanguage: {
          sProcessing: '<i class="fa fa-spinner fa-spin" \
          style="font-size:24px"></i> Processing...',
          serverSide: true,
          ajax: {
            url: ajaxUrl,
            type: 'POST',
            error: (xhr, message, error) => {
              msg = `Please refresh the page. ${error}.`
              if (typeof xhr != 'undefined' && typeof xhr.responseJSON != 'undefined') {
                msg += ` ${xhr.responseJSON['error']}`
              }
              flash_alert(msg)
            },
            deferLoading: totalLength,
          }
        }
      }
    }
    return { ...options, ...ajaxOptions }
  }

  return {
    initialise
  }
  // module.exports = { initialise }
}))
