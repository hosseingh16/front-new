<template>
  <ClientOnly>
    <component
      :is="Editor"
      v-if="ready"
      :key="themeKey"
      v-model="model"
      :init="editorInit"
      license-key="gpl"
      :disabled="disabled"
    />
    <div
      v-else
      class="h-[280px] animate-pulse rounded-lg border border-gray-default bg-surface-100"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

const model = defineModel<string>({ default: '' })

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    placeholder?: string
    height?: number
  }>(),
  {
    disabled: false,
    placeholder: 'متن را وارد کنید...',
    height: 280,
  },
)

const { isDark } = useAppTheme()
const themeKey = computed(() => (isDark.value ? 'dark' : 'light'))

const Editor = shallowRef<Component | null>(null)
const ready = ref(false)

const editorInit = computed(() => ({
  height: props.height,
  menubar: false,
  language: 'fa',
  directionality: 'rtl',
  plugins: ['lists'],
  toolbar: 'undo redo | bold italic | bullist numlist',
  branding: false,
  promotion: false,
  placeholder: props.placeholder,
  statusbar: false,
  skin: isDark.value ? 'oxide-dark' : 'oxide',
  content_css: isDark.value ? 'dark' : 'default',
}))

async function setupTinyMce() {
  await import('tinymce/tinymce')
  await import('tinymce/themes/silver')
  await import('tinymce/icons/default')
  await import('tinymce/models/dom')
  await import('tinymce/plugins/lists')
  // @ts-expect-error language pack has no type declarations
  await import('tinymce-i18n/langs8/fa')
  await import('tinymce/skins/ui/oxide/skin.js')
  await import('tinymce/skins/ui/oxide-dark/skin.js')
  await import('tinymce/skins/content/default/content.js')
  await import('tinymce/skins/content/dark/content.js')

  const module = await import('@tinymce/tinymce-vue')
  Editor.value = module.default
  ready.value = true
}

onMounted(() => {
  if (!import.meta.client) return
  setupTinyMce()
})
</script>
