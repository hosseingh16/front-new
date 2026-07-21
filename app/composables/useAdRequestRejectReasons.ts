import type { ISelectItem } from '~/types/select-item'
import { AD_REQUEST_REJECT_REASONS } from '~/utils/employer-ad-request-lookups'

const REJECT_REASONS_LOOKUP_KEY = 'ad_request_reject_reasons'

export function useAdRequestRejectReasons() {
  const { items, loading, ready } = useLookups(REJECT_REASONS_LOOKUP_KEY)
  const lookupReasons = items(REJECT_REASONS_LOOKUP_KEY)

  const reasons = computed<ISelectItem[]>(() => {
    if (lookupReasons.value.length) return lookupReasons.value
    // Local fallback is available immediately; don't block the select on API.
    return AD_REQUEST_REJECT_REASONS
  })

  // Never keep the UI disabled when fallback options already exist.
  const resolvedLoading = computed(
    () => !ready.value && loading.value && reasons.value.length === 0,
  )

  return {
    reasons,
    loading: resolvedLoading,
  }
}
