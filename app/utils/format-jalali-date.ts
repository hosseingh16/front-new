import moment from 'moment-jalaali'
import 'moment/locale/fa'

moment.loadPersian({ usePersianDigits: false })

export function formatJalaliDate(
  date: string | null | undefined,
  format = 'jD jMMMM jYYYY',
): string {
  if (!date) return ''

  const parsed = /^\d{8}$/.test(date)
    ? moment(date, 'YYYYMMDD')
    : moment(date)

  return parsed.isValid() ? parsed.locale('fa').format(format) : ''
}
