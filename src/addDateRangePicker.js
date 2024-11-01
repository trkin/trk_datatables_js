import 'daterangepicker'
import 'daterangepicker/daterangepicker.css'

export default function addDateRangePicker($input, passedOptions) {
  // http://www.daterangepicker.com/#options
  let format = passedOptions.dateRangePickerDateFormat || 'DD-MMM-YYYY'
  let timePicker = false
  if ($input.closest('th').data("datatableRange") == "datetime") {
    format = passedOptions.dateRangePickerDateTimeFormat || 'YYYY-MM-DD hh:mm:ss' // this is default Rails Time.now.to_s (no tz)
    timePicker = true
  }
  let ranges = []
  let showCustomRangeLabel = false

  if ($input.closest('th').data("datatablePredefinedRanges")) {
    ranges = $input.closest('th').data("datatablePredefinedRanges")
    showCustomRangeLabel = true
  }
  $input.daterangepicker({
    autoApply: true,
    timePicker: timePicker,
    timePicker24Hour: true,
    timePickerSeconds: true,
    timePickerIncrement: 5,
    showDropdowns: true,
    locale: {
      format: format,
    },
    ranges: ranges,
    alwaysShowCalendars: true, // to always show calendar even ranges are visible and user click on Today
    showCustomRangeLabel: showCustomRangeLabel,
    opens: 'left',
    autoUpdateInput: false, // we need to disable since it will use todays value,
    // we want initially empty (so we populate on events)
  }).on('apply.daterangepicker', (ev, picker) => $input.val(picker.startDate.format(format) + ' - ' +
                       picker.endDate.format(format)).change()
  )
} // const addDateRangePicker = function($input) {
