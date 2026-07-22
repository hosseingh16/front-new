export type TaxReturnActivityType = 'خدماتی' | 'بازرگانی' | 'تولیدی'

export type TaxReturnFormModel = {
  name: string
  cellphone: string
  email: string
  activity_type: TaxReturnActivityType | ''
  desc: string
  province: number | null
  province_name: string
  city: number | null
  city_name: string
  lat: number | null
  long: number | null
}

export type TaxReturnFormErrors = Partial<
  Record<
    | 'name'
    | 'cellphone'
    | 'email'
    | 'activity_type'
    | 'desc'
    | 'province'
    | 'city'
    | 'location',
    string
  >
>

export type TaxReturnStorePayload = {
  name?: string | null
  cellphone?: string | null
  email?: string | null
  activity_type: TaxReturnActivityType
  desc: string
  province_id: number
  city_id: number
  lat?: number | null
  long?: number | null
}

export const TAX_RETURN_ACTIVITY_OPTIONS = [
  { label: 'خدماتی', value: 'خدماتی' },
  { label: 'بازرگانی', value: 'بازرگانی' },
  { label: 'تولیدی', value: 'تولیدی' },
] as const

export const TAX_RETURN_DESC_MAX = 500

export const TAX_RETURN_PAYABLE_PRICE = 1_000_000

export function createEmptyTaxReturnForm(): TaxReturnFormModel {
  return {
    name: '',
    cellphone: '',
    email: '',
    activity_type: '',
    desc: '',
    province: null,
    province_name: '',
    city: null,
    city_name: '',
    lat: null,
    long: null,
  }
}
