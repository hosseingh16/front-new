export interface TaxReturnConsultant {
  id: number
  name: string
  job_title?: string | null
  avatar?: string | null
  description?: string | null
  cv_slug?: string | null
  province_id?: number | null
  province_name?: string | null
  city_id?: number | null
  city_name?: string | null
  is_tax_return_consultant?: boolean
  tax_return_price_min?: number | null
  tax_return_price_max?: number | null
  consultant_price_min?: number | null
  consultant_price_max?: number | null
}
