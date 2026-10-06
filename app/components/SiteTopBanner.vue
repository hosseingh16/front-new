<template>
  <div
    v-if="banner && !isOnBannerTarget"
    class="w-full"
    :style="bannerStyle"
  >
    <component
      :is="rootTag"
      v-bind="rootBindings"
      class="relative block w-full overflow-hidden"
    >
      <picture>
        <source
          v-if="mobileImage"
          media="(max-width: 767px)"
          :srcset="mobileImage"
        />
        <source
          v-if="tabletImage"
          media="(max-width: 1023px)"
          :srcset="tabletImage"
        />
        <img
          :src="defaultImage"
          :alt="banner.title || banner.name || 'بنر'"
          class="block h-auto w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </picture>

      <div
        v-if="hasCta"
        class="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/40 to-transparent px-4 pb-4 pt-10 sm:justify-end sm:px-8 lg:px-16"
      >
        <div
          class="inline-flex flex-col items-center rounded-xl px-4 py-2 text-white sm:items-start"
          :style="buttonStyle"
        >
          <span class="text-sm font-yb-bold">{{ banner.button_title }}</span>
          <span
            v-if="banner.button_subtitle"
            class="text-xs opacity-90"
          >
            {{ banner.button_subtitle }}
          </span>
        </div>
      </div>
    </component>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const requestURL = useRequestURL()
const { banner } = useLatestBanner()

/** srcset treats spaces as URL/descriptor separators — encode before use. */
function toSrcSetUrl(value: string | null | undefined): string {
  const url = value?.trim()
  if (!url) return ''
  try {
    return encodeURI(decodeURI(url))
  } catch {
    return encodeURI(url)
  }
}

function normalizePath(path: string): string {
  if (!path) return '/'
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

/** Path of the banner link when it points at this site; otherwise null. */
function pathFromHref(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed)
      if (url.origin !== requestURL.origin) return null
      return url.pathname
    } catch {
      return null
    }
  }

  return trimmed.split(/[?#]/)[0] || '/'
}

const defaultImage = computed(() =>
  toSrcSetUrl(
    banner.value?.default_image ||
      banner.value?.tablet_image ||
      banner.value?.mobile_image,
  ),
)

// Only emit <source> when that size has its own asset.
// Falling back to default_image makes every breakpoint identical.
const tabletImage = computed(() => toSrcSetUrl(banner.value?.tablet_image))

const mobileImage = computed(() => toSrcSetUrl(banner.value?.mobile_image))

const bannerStyle = computed(() => {
  const color = banner.value?.background_color?.trim()
  return color ? { backgroundColor: color } : undefined
})

const buttonStyle = computed(() => ({
  backgroundColor: banner.value?.button_color?.trim() || '#4864e1',
}))

const href = computed(() => banner.value?.url?.trim() || '')
const isExternal = computed(() => /^https?:\/\//i.test(href.value))
const hasCta = computed(() => Boolean(banner.value?.button_title?.trim()))

const isOnBannerTarget = computed(() => {
  const target = pathFromHref(href.value)
  if (!target) return false

  const current = normalizePath(route.path)
  const base = normalizePath(target)

  // Hide on the linked page and all nested routes (e.g. /tax-return/*).
  if (base === '/') return current === '/'
  return current === base || current.startsWith(`${base}/`)
})

const NuxtLink = resolveComponent('NuxtLink')

const rootTag = computed(() => {
  if (!href.value) return 'div'
  return isExternal.value ? 'a' : NuxtLink
})

const rootBindings = computed(() => {
  if (!href.value) return {}
  if (isExternal.value) {
    return {
      href: href.value,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
  }
  return { to: href.value }
})
</script>
