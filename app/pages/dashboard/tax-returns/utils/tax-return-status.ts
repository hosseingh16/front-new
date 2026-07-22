/** Mirrors backend `App\Enums\TaxReturnStatus`. */
export type TaxReturnStatusKey =
  | 'pending'
  | 'completed'
  | 'paid'
  | 'cancelled'

export interface TaxReturnStatusMeta {
  key: TaxReturnStatusKey
  label: string
  className: string
  dotColor: string
}

const STATUS_META: Record<
  TaxReturnStatusKey,
  Omit<TaxReturnStatusMeta, 'key'> & { match: RegExp }
> = {
  pending: {
    // API may return Status::PENDING label ("در انتظار بررسی")
    match: /انتظار تکمیل پرداخت|در انتظار بررسی|pending/i,
    label: 'در انتظار تکمیل پرداخت',
    className: 'bg-[#FFF3E8] text-[#B95C04]',
    dotColor: '#B95C04',
  },
  completed: {
    match: /تکمیل شده|completed/i,
    label: 'تکمیل شده',
    className: 'bg-[#E8F5E9] text-[#2E7D32]',
    dotColor: '#2E7D32',
  },
  paid: {
    match: /پرداخت شده|paid/i,
    label: 'پرداخت شده',
    className: 'bg-[#E6F6F0] text-[#009F65]',
    dotColor: '#009F65',
  },
  cancelled: {
    match: /لغو شده|cancelled|canceled/i,
    label: 'لغو شده',
    className: 'bg-[#FDECEB] text-[#EF4035]',
    dotColor: '#EF4035',
  },
}

const STATUS_ORDER: TaxReturnStatusKey[] = [
  'pending',
  'paid',
  'completed',
  'cancelled',
]

export function getTaxReturnStatusMeta(
  status?: string | null,
): TaxReturnStatusMeta {
  const raw = (status ?? '').trim()

  for (const key of STATUS_ORDER) {
    const meta = STATUS_META[key]
    if (meta.match.test(raw)) {
      return {
        key,
        label: meta.label,
        className: meta.className,
        dotColor: meta.dotColor,
      }
    }
  }

  return {
    key: 'pending',
    label: raw || STATUS_META.pending.label,
    className: 'bg-surface-100 text-text-passive',
    dotColor: '#9CA3AF',
  }
}

export function canCancelTaxReturn(status?: string | null) {
  const meta = getTaxReturnStatusMeta(status)
  return meta.key === 'pending' || meta.key === 'paid'
}
