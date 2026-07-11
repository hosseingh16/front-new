import type { EmployerAdRequest } from '~/types/employer-ad-request'

function displayValue(value?: string | number | null, fallback = '—') {
  if (value == null) return fallback
  const text = String(value).trim()
  return text || fallback
}

export function getAdRequestJobTitle(request: EmployerAdRequest) {
  return (
    request.user?.personal?.job_title ||
    request.requested_job_title ||
    request.user?.personal?.wanted_job ||
    '—'
  )
}

export function getAdRequestEmploymentType(request: EmployerAdRequest) {
  return displayValue(request.user?.personal?.job_status, '')
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
      ? { key: 'employment', label: employmentType, icon: 'tabler:file-text' }
      : null,
    salary ? { key: 'salary', label: salary, icon: 'svg:wallet' } : null,
    experience
      ? { key: 'experience', label: experience, icon: 'svg:work-history' }
      : null,
    age ? { key: 'age', label: age, icon: 'svg:timer' } : null,
    phone ? { key: 'phone', label: phone, icon: 'svg:phone' } : null,
    location
      ? { key: 'location', label: location, icon: 'svg:location-4' }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; icon: string }>
}

export function getAdRequestMobileTags(request: EmployerAdRequest) {
  return getAdRequestDisplayItems(request).filter((item) =>
    ['employment', 'salary', 'experience'].includes(item.key),
  )
}
