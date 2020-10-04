import dayjs from 'dayjs'
import { Breakpoint, DateFormatOptions } from './types'

/**
 * Responsive date formatter using dayjs format().
 *
 * Default formatting: { long: 'MMMM D, YYYY', short: 'YYYY-MM-DD' }
 * @param breakpoint {Breakpoint} - Current breakpoint, bind from parent \<data-table\>
 * @param dateStr {string} - Passed to dayjs constructor
 * @param format {string} - Passed to dayjs format()
 */
export function responsiveDate(
  breakpoint: Breakpoint,
  dateStr: string,
  format: DateFormatOptions = { long: 'MMMM D, YYYY', short: 'YYYY-MM-DD' }
): string {
  if (breakpoint < 2) {
    return dayjs(dateStr).format(format.short)
  } else {
    return dayjs(dateStr).format(format.long)
  }
}
