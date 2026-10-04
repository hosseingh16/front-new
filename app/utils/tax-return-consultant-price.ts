import { formatPayablePrice } from '~/utils/tax-return-payload'

const MILLION = 1_000_000

export function formatTaxReturnConsultantPrice(
  value: number | null | undefined,
): string {
  if (value == null || value <= 0) return 'قیمت اعلام نشده'

  if (value >= MILLION && value % MILLION === 0) {
    return `${formatPayablePrice(value / MILLION)} میلیون تومان`
  }

  return `${formatPayablePrice(value)} تومان`
}

/** Short form used in list cards, e.g. "۱ میلیون" */
export function formatTaxReturnConsultantPriceShort(
  value: number | null | undefined,
): string | null {
  if (value == null || value <= 0) return null

  if (value >= MILLION) {
    const millions = value / MILLION
    const rounded =
      Number.isInteger(millions) || millions % 1 === 0
        ? millions
        : Number(millions.toFixed(1))
    return `${formatPayablePrice(rounded)} میلیون`
  }

  return `${formatPayablePrice(value)} تومان`
}

export function formatTaxReturnConsultantPriceRange(
  min: number | null | undefined,
  max: number | null | undefined,
): string {
  const minText = formatTaxReturnConsultantPriceShort(min)
  const maxText =
    max == null
      ? 'متناسب با شرایط پرونده'
      : formatTaxReturnConsultantPriceShort(max)

  if (minText && maxText) return `حداقل: ${minText} - حداکثر: ${maxText}`
  if (minText) return `حداقل: ${minText}`
  if (maxText) return `حداکثر: ${maxText}`
  return 'قیمت نامشخص'
}
