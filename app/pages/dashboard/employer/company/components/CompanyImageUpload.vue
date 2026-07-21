<template>
  <div>
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="accept.map((ext) => `.${ext}`).join(',')"
      @change="onSelect"
    />
    <div
      class="upload-dropzone-bg flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-default p-6"
      @click="inputRef?.click()"
    >
      <Icon name="svg:upload" size="28" class="shrink-0 text-primary-500" />
      <div>
        <div class="flex flex-wrap items-center gap-1">
          <span class="text-sm font-semibold text-primary-500">{{ title }}</span>
          <span class="text-sm text-text-tertiary max-lg:hidden">
            یا تصویر را بکشید و در این محل رها کنید
          </span>
        </div>
        <p class="mt-1 text-sm text-text-muted">
          حداکثر سایز فایل: {{ maxSize }}MB، پسوند‌های مجاز: {{ accept.join(', ') }}
        </p>
      </div>
    </div>
    <p v-if="localError" class="mt-1 text-xs text-[#EF4035]">{{ localError }}</p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    accept?: string[]
    maxSize?: number
  }>(),
  {
    title: 'برای آپلود تصویر کلیک کنید',
    accept: () => ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    maxSize: 2,
  },
)

const emit = defineEmits<{
  select: [file: File]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const localError = ref('')

function onSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (!file) return

  localError.value = ''

  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!props.accept.includes(ext)) {
    localError.value = `فقط فرمت ${props.accept.join(' و ')} مجاز است`
    return
  }

  if (file.size > props.maxSize * 1024 * 1024) {
    localError.value = `حجم تصویر نباید بیشتر از ${props.maxSize}MB باشد`
    return
  }

  emit('select', file)
}
</script>
