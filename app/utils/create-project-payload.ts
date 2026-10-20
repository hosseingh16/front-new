import type {
  CreateProjectFormErrors,
  CreateProjectFormModel,
} from '~/types/create-project-form'
import {
  PROJECT_DESC_MAX_LENGTH,
  PROJECT_DESC_MIN_LENGTH,
  PROJECT_MIN_BUDGET,
} from '~/types/create-project-form'
import {
  getProjectAreas,
  getProjectBudgetPreset,
  getProjectTimePreset,
} from '~/data/project-types'

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

function resolveTimeRange(form: CreateProjectFormModel) {
  if (form.time_mode === 'custom') {
    return {
      min: form.min_time_value,
      max: form.max_time_value,
    }
  }

  const preset = getProjectTimePreset(form.time_mode)
  return {
    min: preset?.min ?? null,
    max: preset?.max ?? null,
  }
}

function resolveBudgetRange(form: CreateProjectFormModel) {
  if (form.budget_mode === 'custom') {
    return {
      min: form.min_budget,
      max: form.max_budget,
    }
  }

  const preset = getProjectBudgetPreset(form.budget_mode)
  return {
    min: preset?.min ?? null,
    max: preset?.max ?? null,
  }
}

export function validateCreateProjectForm(
  form: CreateProjectFormModel,
): CreateProjectFormErrors {
  const errors: CreateProjectFormErrors = {}

  if (!form.category.trim()) {
    errors.category = 'دسته‌بندی پروژه الزامی است'
  }

  if (!form.type.trim()) {
    errors.type = 'نوع پروژه الزامی است'
  }

  const allowedAreas = new Set(
    getProjectAreas(form.type).map((item) => String(item.value)),
  )
  const scopes = form.scopes.filter((item) => allowedAreas.has(item))

  if (form.type && !scopes.length) {
    errors.scopes = 'حداقل یک حوزه کاری را انتخاب کنید'
  }

  const description = form.desc.trim()
  if (form.type) {
    if (description.length < PROJECT_DESC_MIN_LENGTH) {
      errors.desc = `شرح خدمات باید حداقل ${PROJECT_DESC_MIN_LENGTH} کاراکتر باشد`
    } else if (description.length > PROJECT_DESC_MAX_LENGTH) {
      errors.desc = `شرح خدمات نباید بیشتر از ${PROJECT_DESC_MAX_LENGTH} کاراکتر باشد`
    }
  }

  if (!form.presence_mode) {
    errors.presence_mode = 'نحوه انجام پروژه الزامی است'
  }

  if (!form.time_mode.trim()) {
    errors.time = 'انتخاب زمان الزامی است'
  } else {
    const time = resolveTimeRange(form)
    if (time.min == null) {
      errors.min_time = 'حداقل زمان الزامی است'
    }
    if (time.max == null) {
      errors.max_time = 'حداکثر زمان الزامی است'
    } else if (time.min != null && time.max < time.min) {
      errors.max_time = 'حداکثر زمان نمی‌تواند کمتر از حداقل زمان باشد'
    }
  }

  if (!form.budget_mode.trim()) {
    errors.budget = 'انتخاب بودجه الزامی است'
  } else {
    const budget = resolveBudgetRange(form)
    if (budget.min == null) {
      errors.min_budget = 'حداقل بودجه الزامی است'
    } else if (budget.min < PROJECT_MIN_BUDGET) {
      errors.min_budget = `حداقل بودجه ${formatBudgetInput(PROJECT_MIN_BUDGET)} تومان است`
    }

    if (budget.max == null) {
      errors.max_budget = 'حداکثر بودجه الزامی است'
    } else if (budget.min != null && budget.max < budget.min) {
      errors.max_budget = 'حداکثر بودجه نمی‌تواند کمتر از حداقل بودجه باشد'
    }
  }

  return errors
}

export function buildCreateProjectPayload(form: CreateProjectFormModel) {
  const allowedAreas = new Set(
    getProjectAreas(form.type).map((item) => String(item.value)),
  )
  const scopes = form.scopes.filter((item) => allowedAreas.has(item))
  const time = resolveTimeRange(form)
  const budget = resolveBudgetRange(form)

  return {
    category: form.category.trim(),
    type: form.type,
    scopes,
    desc: form.desc.trim(),
    needs_presence: form.presence_mode === 'required',
    min_time: time.min,
    max_time: time.max,
    min_budget: budget.min,
    max_budget: budget.max,
  }
}
