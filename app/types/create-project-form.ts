export type ProjectPresenceMode = 'required' | 'not_required'

export interface CreateProjectFormModel {
  type: string
  scopes: string[]
  desc: string
  presence_mode: ProjectPresenceMode | ''
  time_mode: string
  min_time_value: number | null
  max_time_value: number | null
  budget_mode: string
  min_budget: number | null
  max_budget: number | null
}

export interface CreateProjectFormErrors {
  type?: string
  scopes?: string
  desc?: string
  presence_mode?: string
  min_time?: string
  max_time?: string
  min_budget?: string
  max_budget?: string
}

export const CREATE_PROJECT_DRAFT_KEY = 'create-project-draft'

export const PROJECT_DESC_MAX_LENGTH = 2000
export const PROJECT_DESC_MIN_LENGTH = 10
export const PROJECT_MIN_BUDGET = 10_000_000

export function createEmptyCreateProjectForm(): CreateProjectFormModel {
  return {
    type: '',
    scopes: [],
    desc: '',
    presence_mode: '',
    time_mode: 'custom',
    min_time_value: null,
    max_time_value: null,
    budget_mode: 'custom',
    min_budget: null,
    max_budget: null,
  }
}
