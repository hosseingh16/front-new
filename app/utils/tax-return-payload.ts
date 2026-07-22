import type {
  TaxReturnActivityType,
  TaxReturnFormErrors,
  TaxReturnFormModel,
  TaxReturnStorePayload,
} from '~/types/tax-return-form'
import { TAX_RETURN_DESC_MAX } from '~/types/tax-return-form'

const ACTIVITY_TYPES: TaxReturnActivityType[] = [
  'خدماتی',
  'بازرگانی',
  'تولیدی',
]

export function validateTaxReturnForm(
  form: TaxReturnFormModel,
): TaxReturnFormErrors {
  const errors: TaxReturnFormErrors = {}

  if (!form.activity_type) {
    errors.activity_type = 'نوع فعالیت الزامی است.'
  } else if (
    !ACTIVITY_TYPES.includes(form.activity_type as TaxReturnActivityType)
  ) {
    errors.activity_type = 'نوع فعالیت انتخاب‌شده معتبر نیست.'
  }

  const desc = form.desc.trim()
  if (!desc) {
    errors.desc = 'توضیحات الزامی است.'
  } else if (desc.length > TAX_RETURN_DESC_MAX) {
    errors.desc = `توضیحات نباید بیشتر از ${TAX_RETURN_DESC_MAX} کاراکتر باشد.`
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'ایمیل وارد شده معتبر نیست.'
  }

  if (form.province == null) {
    errors.province = 'استان محل کسب و کار الزامی است.'
  }

  if (form.city == null) {
    errors.city = 'شهر محل کسب و کار الزامی است.'
  }

  if (form.lat == null || form.long == null) {
    errors.location = 'موقعیت روی نقشه را انتخاب کنید.'
  }

  return errors
}

export function buildTaxReturnPayload(
  form: TaxReturnFormModel,
): TaxReturnStorePayload {
  const payload: TaxReturnStorePayload = {
    activity_type: form.activity_type as TaxReturnActivityType,
    desc: form.desc.trim(),
    province_id: form.province as number,
    city_id: form.city as number,
  }

  const name = form.name.trim()
  if (name) payload.name = name

  const cellphone = form.cellphone.trim()
  if (cellphone) payload.cellphone = cellphone

  const email = form.email.trim()
  if (email) payload.email = email

  if (form.lat != null && form.long != null) {
    payload.lat = form.lat
    payload.long = form.long
  }

  return payload
}

export function isTaxReturnFormReady(form: TaxReturnFormModel) {
  return (
    Boolean(form.activity_type) &&
    Boolean(form.desc.trim()) &&
    form.desc.trim().length <= TAX_RETURN_DESC_MAX &&
    form.province != null &&
    form.city != null &&
    form.lat != null &&
    form.long != null
  )
}

export function formatPayablePrice(value: number) {
  return value
    .toLocaleString('en-US')
    .replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]!)
}
