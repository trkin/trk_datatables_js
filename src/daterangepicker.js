const add = ($input) => {
  // http://www.daterangepicker.com/#options
  if (input.data("dateRange") == "datetime") {
    format = 'DD-MMM-YYYY h:mm A'
    timePicker = true
  } else {
    format = 'DD-MMM-YYYY'
  }
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
    autoUpdateInput: false // we need to disable since it will use todays value,
    // we want initially empty (so we populate on events)
  }).on('apply.daterangepicker', (ev, picker) => {
    $input.val(picker.startDate.format(format) + ' - ' +
                       picker.endDate.format(format)).change()
  })
}
module.exports = add
