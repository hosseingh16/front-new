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
