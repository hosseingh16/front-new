import type { CreateAdFormModel } from '~/types/create-ad-form'
import type { ISelectItem } from '~/types/select-item'

export interface CreateAdPayloadContext {
  jobTitles: ISelectItem[]
  employmentTypes: ISelectItem[]
  experienceLevels: ISelectItem[]
  salaryRanges: ISelectItem[]
  benefits: ISelectItem[]
  accountingPrograms: ISelectItem[]
  educationLevels: ISelectItem[]
  genders: ISelectItem[]
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, '').trim()
}

function resolveLabel(
  options: ISelectItem[],
  value: string | number | null | undefined,
) {
  if (value == null || value === '') return ''
  const match = options.find((item) => String(item.value) === String(value))
  return match?.label ?? String(value)
}

function resolveLabels(
  options: ISelectItem[],
  values: Array<string | number>,
) {
  return values.map((value) => resolveLabel(options, value)).filter(Boolean)
}

export function getResumeTermsPlainLength(value: string) {
  return stripHtml(value).length
}

export function validateCreateAdForm(form: CreateAdFormModel) {
  const errors: Record<string, string> = {}

  if (!form.title.trim()) {
    errors.title = 'عنوان شغلی الزامی است'
  }

  if (!form.employment_type.trim()) {
    errors.employment_type = 'نوع همکاری الزامی است'
  }

  if (getResumeTermsPlainLength(form.resume_terms) < 10) {
    errors.resume_terms = 'شرایط احراز باید حداقل ۱۰ کاراکتر باشد'
  }

  return errors
}

export function buildCreateAdPayload(
  form: CreateAdFormModel,
  context: CreateAdPayloadContext,
) {
  const title =
    resolveLabel(context.jobTitles, form.title) || form.title.trim()
  const employmentType =
    resolveLabel(context.employmentTypes, form.employment_type) ||
    form.employment_type

  const payload: Record<string, unknown> = {
    title,
    employment_type: employmentType,
  }

  if (form.company_address.trim()) {
    payload.company_address = form.company_address.trim()
  }

  if (form.city != null) payload.city = form.city
  if (form.city_name.trim()) payload.city_name = form.city_name.trim()
  if (form.province != null) payload.province = form.province
  if (form.province_name.trim()) payload.province_name = form.province_name.trim()
  const salaryRange =
    resolveLabel(context.salaryRanges, form.salary_range) ||
    form.salary_range.trim()
  if (salaryRange) payload.salary_range = salaryRange

  if (form.minimum_work_experience != null) {
    payload.minimum_work_experience = form.minimum_work_experience
  }

  const gender =
    resolveLabel(context.genders, form.gender) || form.gender.trim()
  if (gender) payload.gender = gender

  const minimumDegree =
    resolveLabel(context.educationLevels, form.minimum_degree) ||
    form.minimum_degree.trim()
  if (minimumDegree) payload.minimum_degree = minimumDegree
  if (form.resume_terms.trim()) payload.resume_terms = form.resume_terms.trim()

  const companySoftware = resolveLabels(
    context.accountingPrograms,
    form.company_software,
  )
  if (companySoftware.length) payload.company_software = companySoftware

  const companyAdvantages = resolveLabels(
    context.benefits,
    form.company_advantages,
  )
  if (companyAdvantages.length) payload.company_advantages = companyAdvantages

  if (form.excel_skill) payload.excel_skill = form.excel_skill
  if (form.maliat_skill) payload.maliat_skill = form.maliat_skill
  if (form.bimeh_skill) payload.bimeh_skill = form.bimeh_skill
  if (form.baha_skill) payload.baha_skill = form.baha_skill

  if (form.work_schedule.trim() || form.travel_need.trim()) {
    payload.static_hours = JSON.stringify({
      schedule: form.work_schedule.trim(),
      travel: form.travel_need.trim(),
    })
  }

  return payload
}
