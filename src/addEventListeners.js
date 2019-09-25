const addEventListeners = (datatable) => {
  let ajaxUrl = datatable.ajax.url()
  datatable.columns().every(function() {
    let column = this
    $('input[type="text"]', column.header()).each(function() {
      // we need to add current value to search
      column.search(this.value)
      // we need to apply search if there is value and not serverside
      if (!ajaxUrl && $(column.header()).data('datatableSearchValue')) datatable.draw()
      // add event listener for change
      $(this).on('keyup change', function() {
        // somehow column.search() is also "" when we clear input field. this
        // is noticable only for client side processing (serverside keep value)
        if (this.value == "" || column.search() != this.value) {
          if ($(column.header()).data().datatableRange && !ajaxUrl) {
            // addRangeSearch is only for client side processing
            // this.value.indexOf(' - ') != -1 # does not cover empty search
            addRangeSearch(column, this.value)
            datatable.draw()
            console.log("input keyup change range search #{this.value}")
          } else {
            column.search(this.value).draw()
            console.log("input keyup change search #{this.value}")
          }
        }
      })
    })

    $('select', column.header()).each(function() {
      // add current value, multi select returns array, so we join by |
      multiple_value = ($(this).val() || []).join('|')
      column.search(multiple_value, true, false)
      // we need to apply search it there is value and not serverside
      if (!ajaxUrl && $(column.header()).data().datatableSearchValue) datatable.draw()
      $(this).on('change', function() {
        multiple_value = ($(this).val() || []).join('|')
        if (column.search() != multiple_value) {
          column.search(multiple_value, true, false).draw()
          console.log("select change search true #{multiple_value}")
        }
      })
    })
  })
}

module.exports = addEventListeners
