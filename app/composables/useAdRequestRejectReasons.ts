import type { ISelectItem } from '~/types/select-item'
import { AD_REQUEST_REJECT_REASONS } from '~/utils/employer-ad-request-lookups'

const REJECT_REASONS_LOOKUP_KEY = 'ad_request_reject_reasons'

export function useAdRequestRejectReasons() {
  const { items, loading } = useLookups(REJECT_REASONS_LOOKUP_KEY)
  const lookupReasons = items(REJECT_REASONS_LOOKUP_KEY)

  const reasons = computed<ISelectItem[]>(() => {
    if (lookupReasons.value.length) return lookupReasons.value
    return AD_REQUEST_REJECT_REASONS
  })

  return {
    reasons,
    loading,
  }
}
