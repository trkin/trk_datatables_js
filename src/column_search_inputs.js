// TODO: check if multiple require add some problems
// since we do not pass $ from index.js
// https://stackoverflow.com/questions/30038680/requiring-same-module-in-multiple-files
var $ = require('jquery')

const add = ($table) => {
  let isColumnSearch = $('[data-datatable-search-value][data-datatable-search-value!=""]', $table).length
  if (isColumnSearch) {
    addInputs($table)
  } else {
    addLabels($table)
  }
  const addInputs = ($table) => {
    $('thead th[data-searchable!="false"]', $table).each(function() {
      if ($table.data('datatableMultiselect')) {
        addMultiselect($table)
      } else {
        addInputBasedOnText($table)
        if ($(this).data('datatableRange')) {
          addRange($table)
        }
      }
    })
  }
}

function addLabels($table) {
  $('thead th').each(function() {
    original_text = $(this).data('original-text')
    if (original_text)
      $(this).html(original_text)
  })
}

function addMultiselect($th){
  text = $th.text()
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
  text = $th.text()
  if (text.length == 0) return

  let klass = ''
  if (text == 'ID') {
    klass = 'column-search__small'
  }
  $th.html("<input class='column-search ${column-search__small}' type='text' placeholder='${text}' />")
  $th.data("original-text", text)
  $('input', $th).on('click', (e) => {
    e.stopPropagation() // prevent reordering since it is on thead
  })
  if ($th.data('datatableSearchValue')) {
    $('input', $th).val($th.data('datatableSearchValue'))
  }
}


function addRange($table) {
  let $input = $('input', $table)
  $input.data('dateRange', $(this).data('datatableRange'))
  $input.data('predefinedRanges', $(this).data('datatablePredefinedRanges'))
  addDateRangePicker($input)
}
module.exports = add
