import type {
  CreateProjectFormErrors,
  CreateProjectFormModel,
} from '~/types/create-project-form'
import {
  PROJECT_DESC_MAX_LENGTH,
  PROJECT_DESC_MIN_LENGTH,
  PROJECT_MIN_BUDGET,
} from '~/types/create-project-form'
import { getProjectAreas } from '~/data/project-types'

export function formatBudgetInput(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return ''
  return value.toLocaleString('en-US')
}

export function parseBudgetInput(raw: string) {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return null
  const amount = Number(digits)
  return Number.isFinite(amount) ? amount : null
}

export function formatBudgetRange(
  min: number | null | undefined,
  max: number | null | undefined,
) {
  if (min == null && max == null) return ''
  const minLabel = min != null ? formatBudgetInput(min) : '—'
  const maxLabel = max != null ? formatBudgetInput(max) : '—'
  return `${minLabel} - ${maxLabel} تومان`
}

export function validateCreateProjectForm(
  form: CreateProjectFormModel,
): CreateProjectFormErrors {
  const errors: CreateProjectFormErrors = {}

  if (!form.type.trim()) {
    errors.type = 'نوع پروژه الزامی است'
  }

  const allowedAreas = new Set(
    getProjectAreas(form.type).map((item) => String(item.value)),
  )
  const scopes = form.scopes.filter((item) => allowedAreas.has(item))

  if (!scopes.length) {
    errors.scopes = 'حداقل یک حوزه پروژه را انتخاب کنید'
  }

  const description = form.desc.trim()
  if (description.length < PROJECT_DESC_MIN_LENGTH) {
    errors.desc = `شرح خدمات باید حداقل ${PROJECT_DESC_MIN_LENGTH} کاراکتر باشد`
  } else if (description.length > PROJECT_DESC_MAX_LENGTH) {
    errors.desc = `شرح خدمات نباید بیشتر از ${PROJECT_DESC_MAX_LENGTH} کاراکتر باشد`
  }

  if (!form.presence_mode) {
    errors.presence_mode = 'نحوه انجام پروژه الزامی است'
  }

  if (form.presence_mode === 'required') {
    if (form.min_time_value == null) {
      errors.min_time = 'حداقل زمان الزامی است'
    }
    if (form.max_time_value == null) {
      errors.max_time = 'حداکثر زمان الزامی است'
    } else if (
      form.min_time_value != null &&
      form.max_time_value < form.min_time_value
    ) {
      errors.max_time = 'حداکثر زمان نمی‌تواند کمتر از حداقل زمان باشد'
    }
  }

  if (form.min_budget == null) {
    errors.min_budget = 'حداقل بودجه الزامی است'
  } else if (form.min_budget < PROJECT_MIN_BUDGET) {
    errors.min_budget = `حداقل بودجه ${formatBudgetInput(PROJECT_MIN_BUDGET)} تومان است`
  }

  if (form.max_budget == null) {
    errors.max_budget = 'حداکثر بودجه الزامی است'
  } else if (form.min_budget != null && form.max_budget < form.min_budget) {
    errors.max_budget = 'حداکثر بودجه نمی‌تواند کمتر از حداقل بودجه باشد'
  }

  return errors
}

export function buildCreateProjectPayload(form: CreateProjectFormModel) {
  const allowedAreas = new Set(
    getProjectAreas(form.type).map((item) => String(item.value)),
  )
  const scopes = form.scopes.filter((item) => allowedAreas.has(item))

  return {
    type: form.type,
    scopes,
    desc: form.desc.trim(),
    needs_presence: form.presence_mode === 'required',
    min_time:
      form.presence_mode === 'required' ? form.min_time_value : null,
    max_time:
      form.presence_mode === 'required' ? form.max_time_value : null,
    min_budget: form.min_budget,
    max_budget: form.max_budget,
  }
}
