import moment from 'moment-jalaali'
import 'moment/locale/fa'

moment.updateLocale('fa', {
  relativeTime: {
    past: '%s قبل',
  },
})
moment.locale('fa')

export function formatRelativeDate(date: string | null | undefined): string {
  if (!date) return ''

  const parsed = /^\d{8}$/.test(date)
    ? moment(date, 'YYYYMMDD')
    : moment(date)

  return parsed.isValid() ? parsed.locale('fa').fromNow() : ''
}
