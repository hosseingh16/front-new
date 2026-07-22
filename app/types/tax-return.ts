export type TaxReturnListItem = {
  id: number
  name?: string | null
  cellphone?: string | null
  activity_type?: string | null
  province_name?: string | null
  city_name?: string | null
  region_name?: string | null
  status?: string | null
}

/** Mirrors backend `TaxReturnResource`. */
export type TaxReturnDetail = {
  id: number
  name?: string | null
  cellphone?: string | null
  activity_type?: string | null
  desc?: string | null
  city_id?: number | null
  province_id?: number | null
  region_id?: number | null
  province_name?: string | null
  city_name?: string | null
  region_name?: string | null
  payable_price?: number | null
  order_id?: number | null
  status?: string | null
  user?: {
    id?: number
    name?: string | null
    email?: string | null
    username?: string | null
  } | null
}
