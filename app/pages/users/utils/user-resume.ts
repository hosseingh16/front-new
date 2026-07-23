import type {
  UserResume,
  UserResumeEducation,
  UserResumePersonal,
  UserResumePrior,
} from '~/types/user-resume'
import type { ISelectItem } from '~/types/select-item'

export function displayResumeValue(value?: string | number | null, fallback = '—') {
  if (value == null) return fallback
  const text = String(value).trim()
  return text || fallback
}

export function resolveResumeLookupLabel(
  options: ISelectItem[] = [],
  value?: string | number | null,
  fallback = '—',
) {
  if (value == null) return fallback

  const text = String(value).trim()
  if (!text) return fallback

  const match = options.find(
    (item) => String(item.value) === text || item.label.trim() === text,
  )

  return match?.label ?? text
}

export function getResumePersonal(user: UserResume | null | undefined) {
  return user?.resume_personal ?? null
}

export function getResumeFullName(user: UserResume | null | undefined) {
  const personal = getResumePersonal(user)
  return displayResumeValue(personal?.name || user?.name)
}

export function getResumeJobTitle(
  user: UserResume | null | undefined,
  jobTitles: ISelectItem[] = [],
) {
  const personal = getResumePersonal(user)
  const raw = personal?.job_title || personal?.wanted_job || user?.job_title
  return resolveResumeLookupLabel(jobTitles, raw)
}

export function getResumeSalary(
  user: UserResume | null | undefined,
  salaryRanges: ISelectItem[] = [],
) {
  const personal = getResumePersonal(user)
  const raw = personal?.salary_range || personal?.desired_salary
  return resolveResumeLookupLabel(salaryRanges, raw)
}

export function getResumeEmploymentStatus(user: UserResume | null | undefined) {
  const personal = getResumePersonal(user)
  const status = personal?.job_status

  if (status === '0') return 'جویای کار'
  if (status === '1') return 'شاغل'

  return displayResumeValue(status)
}

export function getResumeGenderLabel(gender?: string | number | null) {
  if (gender == null || gender === '') return '—'

  const value = String(gender).trim().toLowerCase()

  if (value === 'male' || value === '1') return 'آقا'
  if (value === 'female' || value === '0' || value === '2') return 'خانم'

  return displayResumeValue(gender)
}

export function getResumeMaritalStatusLabel(status?: string | number | null) {
  if (status == null || status === '') return '—'

  const value = String(status).trim()
  if (value === 'single' || value === '0') return 'مجرد'
  if (value === 'married' || value === '1') return 'متأهل'

  return displayResumeValue(status)
}

export function getResumeWorkExperienceLabel(
  value?: string | number | null,
  experienceLevels: ISelectItem[] = [],
) {
  return resolveResumeLookupLabel(experienceLevels, value)
}

export function getResumeMilitaryStatusLabel(
  value?: string | number | null,
  militaryStatuses: ISelectItem[] = [],
) {
  return resolveResumeLookupLabel(militaryStatuses, value)
}

export function getResumeLocationLabel(personal?: UserResumePersonal | null) {
  if (!personal) return '—'

  const parts = [
    personal.city_name,
    personal.region_name,
    personal.province_name,
  ].filter(Boolean)

  return parts.length ? parts.join('، ') : '—'
}

export function getResumeAgeLabel(birthdate?: string | number | null) {
  if (birthdate == null || birthdate === '') return '—'

  const yearMatch = String(birthdate).match(/(\d{4})/)
  if (!yearMatch) return displayResumeValue(birthdate)

  const birthYear = Number(yearMatch[1])
  if (!Number.isFinite(birthYear)) return displayResumeValue(birthdate)

  const age =
    birthYear > 1300
      ? 1405 - birthYear
      : new Date().getFullYear() - birthYear

  if (!Number.isFinite(age) || age <= 0 || age > 120) {
    return displayResumeValue(birthdate)
  }

  return `${age} سال`
}

export function getResumeBirthYearLabel(birthdate?: string | number | null) {
  if (birthdate == null || birthdate === '') return '—'

  const yearMatch = String(birthdate).match(/(\d{4})/)
  if (!yearMatch) return displayResumeValue(birthdate)

  return yearMatch[1]
}

export function getResumeHighestDegree(
  educations: UserResumeEducation[] = [],
  educationLevels: ISelectItem[] = [],
) {
  if (!educations.length) return '—'
  return resolveResumeLookupLabel(educationLevels, educations[0]?.degree)
}

export function maskResumePhone(phone?: string | null) {
  if (!phone?.trim()) return '—'

  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return phone

  const visibleStart = digits.slice(0, 4)
  const visibleEnd = digits.slice(-3)
  return `${visibleStart}***${visibleEnd}`
}

export function maskResumeEmail(email?: string | null) {
  if (!email?.trim()) return '—'

  const [local, domain] = email.split('@')
  if (!local || !domain) return email

  const visible = local.length <= 2 ? local : `${local.slice(0, 2)}***`
  return `${visible}@${domain}`
}

export function formatResumePeriod(
  startYear?: string | number | null,
  endYear?: string | number | null,
  stillBusy?: boolean | number | null,
) {
  const start = displayResumeValue(startYear, '')
  const end = stillBusy ? 'الان' : displayResumeValue(endYear, '')

  if (!start && !end) return '—'
  if (start && end) return `از ${start} تا ${end}`
  if (start) return `از ${start}`
  return `تا ${end}`
}

export function getResumePriorTitle(
  prior: UserResumePrior,
  jobTitles: ISelectItem[] = [],
) {
  return resolveResumeLookupLabel(jobTitles, prior.title)
}

export function getResumePriorSubtitle(
  prior: UserResumePrior,
  options: {
    jobTitles?: ISelectItem[]
    employmentTypes?: ISelectItem[]
    years?: ISelectItem[]
  } = {},
) {
  const type = resolveResumeLookupLabel(
    options.employmentTypes,
    prior.employment_type,
    '',
  )
  const company = displayResumeValue(prior.company_name, '')
  const period = formatResumePeriod(
    resolveResumeLookupLabel(options.years, prior.start_year, ''),
    resolveResumeLookupLabel(options.years, prior.end_year, ''),
    prior.still_busy,
  )

  const parts = [company, period].filter((part) => part && part !== '—')
  const title = [getResumePriorTitle(prior, options.jobTitles), type]
    .filter(Boolean)
    .join(' · ')

  return {
    title,
    meta: parts.join(' · ') || '—',
  }
}

export function getResumeEducationSubtitle(
  education: UserResumeEducation,
  options: {
    educationLevels?: ISelectItem[]
    graduationYears?: ISelectItem[]
  } = {},
) {
  const degree = resolveResumeLookupLabel(
    options.educationLevels,
    education.degree,
    '',
  )
  const major = displayResumeValue(education.major, '')
  const university = displayResumeValue(education.university, '')
  const period = education.stillbusy
    ? `تا الان`
    : resolveResumeLookupLabel(
        options.graduationYears,
        education.enddate,
        '',
      )

  return {
    title: [degree, major].filter(Boolean).join(' · ') || '—',
    meta: [university, period].filter(Boolean).join(' · ') || '—',
  }
}

export function toResumePercent(value?: string | number | null) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric) || numeric <= 0) return 0
  if (numeric <= 10) return numeric * 10
  return Math.max(0, Math.min(100, numeric))
}

export function toResumeScore(value?: string | number | null) {
  return toResumePercent(value)
}

export function getResumeEducationItem(
  education: UserResumeEducation,
  options: {
    educationLevels?: ISelectItem[]
    graduationYears?: ISelectItem[]
  } = {},
) {
  const degree = resolveResumeLookupLabel(
    options.educationLevels,
    education.degree,
    '',
  )
  const major = displayResumeValue(education.major, '')
  const university = displayResumeValue(education.university)
  const period = education.stillbusy
    ? 'مشغول به تحصیل'
    : resolveResumeLookupLabel(
        options.graduationYears,
        education.enddate,
      )

  return {
    id: education.id,
    title: [degree, major].filter((part) => part && part !== '—').join(' · ') || '—',
    university,
    period,
    description: education.description?.trim() || '',
  }
}

export function getResumePriorItem(
  prior: UserResumePrior,
  options: {
    jobTitles?: ISelectItem[]
    employmentTypes?: ISelectItem[]
    years?: ISelectItem[]
  } = {},
) {
  const title = resolveResumeLookupLabel(options.jobTitles, prior.title, '')
  const type = resolveResumeLookupLabel(
    options.employmentTypes,
    prior.employment_type,
    '',
  )
  const company = displayResumeValue(prior.company_name)
  const period = formatResumePeriod(
    resolveResumeLookupLabel(options.years, prior.start_year, ''),
    resolveResumeLookupLabel(options.years, prior.end_year, ''),
    prior.still_busy,
  )

  return {
    id: prior.id,
    title,
    type,
    company,
    period,
    description: prior.description?.trim() || '',
  }
}

export function getResumeSoftwareItems(user: UserResume | null | undefined) {
  return (user?.resume_softwares ?? []).map((software) => ({
    id: software.id,
    name: displayResumeValue(software.name),
    initial: displayResumeValue(software.name).charAt(0) || 'ن',
    subsystems: [
      { label: 'انبار', value: displayResumeValue(software.anbar, '۰') },
      { label: 'مالی', value: displayResumeValue(software.mali, '۰') },
      { label: 'حقوق', value: displayResumeValue(software.hoghogh, '۰') },
      { label: 'فروش', value: displayResumeValue(software.forosh, '۰') },
      { label: 'نقد و بانک', value: displayResumeValue(software.naghdobank, '۰') },
    ],
  }))
}

export function getResumeSkillItems(user: UserResume | null | undefined) {
  const skills = user?.resume_skills

  return [
    { label: 'میزان تسلط به اکسل:', percent: toResumePercent(skills?.excel_score) },
    { label: 'میزان تجربه در حوزه حسابداری پیمان:', percent: toResumePercent(skills?.contract_accounting) },
    { label: 'میزان آشنایی به حسابداری بهای تمام شده:', percent: toResumePercent(skills?.flat_cost) },
    { label: 'میزان آشنایی به تهیه صورت مالی استاندارد:', percent: toResumePercent(skills?.standard_statements) },
  ]
}

export function getResumeTaxSkillItems(user: UserResume | null | undefined) {
  const potential = user?.resume_potential

  return [
    { label: 'میزان آشنایی با مالیات ارزش افزوده:', percent: toResumePercent(potential?.value_added_tax_score) },
    { label: 'میزان آشنایی به بیمه‌های پرسنلی و قراردادی:', percent: toResumePercent(potential?.personal_insurance_score) },
    { label: 'میزان آشنایی به مالیات عملکرد:', percent: toResumePercent(potential?.performance_tax_score) },
    { label: 'میزان آشنایی به سامانه مودیان و پایانه‌های فروشگاهی:', percent: toResumePercent(potential?.terminals) },
  ]
}

export function resolveResumeAttachment(user: UserResume | null | undefined) {
  const file = user?.resume_file?.trim()
  if (!file) return null

  const name = file.split('/').pop() || 'resume.pdf'
  const url = file.startsWith('http') ? file : file

  return { name, url }
}
