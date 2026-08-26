import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { DEFAULT_COMPANY_LOGO_SRC } from '~/libs/utils'
import { resolveCompanyLogoDisplaySrc } from '~/utils/company-basic-info'

export function useCompanyLogoDisplaySrc(
  source: MaybeRefOrGetter<string | null | undefined>,
) {
  const config = useRuntimeConfig()
  const failed = ref(false)

  const apiOrigin = computed(() =>
    String(config.public.apiBase ?? ''),
  )

  watch(
    () => toValue(source),
    () => {
      failed.value = false
    },
  )

  const logoSrc = computed(() => {
    if (failed.value) return DEFAULT_COMPANY_LOGO_SRC
    return resolveCompanyLogoDisplaySrc(toValue(source), apiOrigin.value)
  })

  function onLogoError() {
    failed.value = true
  }

  return {
    logoSrc,
    onLogoError,
  }
}
