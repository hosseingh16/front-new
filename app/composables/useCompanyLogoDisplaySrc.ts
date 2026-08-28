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
    String(config.public.baseUrl || config.public.apiBase || ''),
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
    if (failed.value) return
    failed.value = true
  }

  /** Catch images that already 404'd before Vue hydrated (SSR). */
  function bindLogoImg(el: unknown) {
    if (!(el instanceof HTMLImageElement)) return
    if (el.complete && el.naturalWidth === 0) {
      onLogoError()
    }
  }

  return {
    logoSrc,
    onLogoError,
    bindLogoImg,
  }
}
