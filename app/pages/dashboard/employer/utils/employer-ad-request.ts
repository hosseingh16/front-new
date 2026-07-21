import type { EmployerAdRequest } from '~/types/employer-ad-request'
import type { ISelectItem } from '~/types/select-item'
import { formatJalaliDate } from '~/utils/format-jalali-date'

export type AdRequestStatusKey =
  | 'sent'
  | 'seen'
  | 'pending'
  | 'approved'
  | 'rejected'

export interface AdRequestStatusMeta {
  key: AdRequestStatusKey
  label: string
  className: string
  dotColor: string
}

const AD_REQUEST_STATUS_META: Record<
  AdRequestStatusKey,
  Omit<AdRequestStatusMeta, 'key'>
> = {
  sent: {
    label: 'ارسال برای کارفرما',
    className: 'bg-[#F2F2F2] text-[#4A4A4A]',
    dotColor: '#4A4A4A',
  },
  seen: {
    label: 'مشاهده شده',
    className: 'bg-[#E5F5FD] text-[#0098E7]',
    dotColor: '#0098E7',
  },
  pending: {
    label: 'در انتظار تعیین وضعیت',
    className: 'bg-[#FFF3E8] text-[#B95C04]',
    dotColor: '#B95C04',
  },
  approved: {
    label: 'تایید برای مصاحبه',
    className: 'bg-[#E6F6F0] text-[#009F65]',
    dotColor: '#009F65',
  },
  rejected: {
    label: 'رد شده',
    className: 'bg-[#FDECEB] text-[#EF4035]',
    dotColor: '#EF4035',
  },
}

function normalizeAdRequestStatusText(value: string) {
  return value
    .replace(/أ|إ|آ/g, 'ا')
    .replace(/ئ/g, 'ی')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
}

export function resolveAdRequestStatusKey(
  request: Pick<EmployerAdRequest, 'status' | 'seen'>,
): AdRequestStatusKey {
  const status = normalizeAdRequestStatusText((request.status ?? '').trim())

  if (status.includes('رد')) return 'rejected'
  if (status.includes('تایید')) return 'approved'
  if (status.includes('در انتظار') || status.includes('تعیین وضعیت')) {
    return 'pending'
  }
  if (status.includes('مشاهده')) return 'seen'
  if (request.seen) return 'seen'
  if (status.includes('ارسال') || status.includes('بررسی نشده')) return 'sent'

  return 'sent'
}

export function getAdRequestStatusMeta(
  request: Pick<EmployerAdRequest, 'status' | 'seen'>,
): AdRequestStatusMeta {
  const key = resolveAdRequestStatusKey(request)
  return { key, ...AD_REQUEST_STATUS_META[key] }
}

function displayValue(value?: string | number | null, fallback = '—') {
  if (value == null) return fallback
  const text = String(value).trim()
  return text || fallback
}

function resolveLookupLabel(
  options: ISelectItem[],
  value?: string | null,
  fallback = '—',
) {
  if (value == null) return fallback

  const text = String(value).trim()
  if (!text) return fallback

  const match = options.find((item) => String(item.value) === text)
  return match?.label ?? text
}

export function getAdRequestJobTitle(
  request: EmployerAdRequest,
  jobTitles: ISelectItem[] = [],
) {
  const raw =
    request.user?.personal?.job_title ||
    request.requested_job_title ||
    request.user?.personal?.wanted_job

  return resolveLookupLabel(jobTitles, raw)
}
export function getAdRequestEmploymentType(request: EmployerAdRequest) {
  const status = request.user?.personal?.job_status

  if (status == null || status == undefined) return ''
  if (Number(status) == 0) return 'جویای کار'
  if (Number(status) == 1) return 'شاغل'

  return ''
}

export function getAdRequestSalary(request: EmployerAdRequest) {
  return displayValue(
    request.user?.personal?.salary_range ||
      request.user?.personal?.desired_salary,
    '',
  )
}

export function getAdRequestExperience(request: EmployerAdRequest) {
  return displayValue(
    request.work_experience || request.user?.personal?.work_experience,
    '',
  )
}

export function formatAdRequestExperience(value?: string) {
  if (!value) return ''
  if (value.includes('سابقه')) return value
  return `${value} سابقه کار`
}

export function getAdRequestPhone(request: EmployerAdRequest) {
  return displayValue(
    request.user?.phone || request.user?.personal?.cellphone,
    '',
  )
}

export function getAdRequestRequestDate(request: EmployerAdRequest) {
  return displayValue(formatJalaliDate(request.created_at), '')
}

export function getAdRequestLocation(request: EmployerAdRequest) {
  const personal = request.user?.personal
  if (!personal) return ''

  const parts = [
    personal.city_name,
    personal.region_name,
    personal.province_name,
  ].filter(Boolean)

  return parts.join('، ')
}

export function getAdRequestAge(request: EmployerAdRequest) {
  const birthdate = request.user?.personal?.birthdate
  if (!birthdate) return ''

  const yearMatch = birthdate.match(/(\d{4})/)
  if (!yearMatch) return ''

  const birthYear = Number(yearMatch[1])
  if (!Number.isFinite(birthYear)) return ''

  const age =
    birthYear > 1300
      ? 1405 - birthYear
      : new Date().getFullYear() - birthYear

  if (!Number.isFinite(age) || age <= 0 || age > 120) return ''
  return `${age} سال`
}

export function getAdRequestDisplayItems(request: EmployerAdRequest) {
  const employmentType = getAdRequestEmploymentType(request)
  const salary = getAdRequestSalary(request)
  const experience = formatAdRequestExperience(getAdRequestExperience(request))
  const age = getAdRequestAge(request)
  const phone = getAdRequestPhone(request)
  const location = getAdRequestLocation(request)

  return [
    employmentType
      ? { key: 'employment', label: employmentType, icon: 'lucide:file-text' }
      : null,
    salary ? { key: 'salary', label: salary, icon: 'svg:wallet' } : null,
    experience
      ? { key: 'experience', label: experience, icon: 'svg:work-history' }
      : null,
    age ? { key: 'age', label: age, icon: 'svg:timer' } : null,
    phone ? { key: 'phone', label: phone, icon: 'lucide:smartphone' } : null,
    location
      ? { key: 'location', label: location, icon: 'lucide:calendar-clock' }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; icon: string }>
}

export function getAdRequestMobileTags(request: EmployerAdRequest) {
  return getAdRequestDisplayItems(request).filter((item) =>
    ['employment', 'salary', 'experience'].includes(item.key),
  )
}
