export interface TaxReturnConsultant {
  id: number
  name: string
  job_title?: string | null
  avatar?: string | null
  description?: string | null
  cv_slug?: string | null
  is_tax_return_consultant?: boolean
  tax_return_price?: number | null
  consultant_price?: number | null
}
