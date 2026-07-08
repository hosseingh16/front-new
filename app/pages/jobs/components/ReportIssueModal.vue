<template>
  <dialog ref="dialogRef" class="modal" @click="handleBackdropClick">
    <div class="modal-box" :style="`max-width:${width}px`">
      <div class="mb-3 flex items-center justify-between pb-3">
        <div class="mb-2 flex items-center gap-2">
          <span
            class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
            aria-hidden="true"
          />
          <h2 class="font-yb-bold text-base text-text-primay">گزارش</h2>
        </div>
        <button type="button" class="cursor-pointer text-text-passive" @click="closeModal">
          <Icon name="material-symbols:close" size="18" />
        </button>
      </div>

      <p class="text-sm leading-6 text-text-passive">
        برای حفظ کیفیت و امنیت فرصت‌های شغلی، در صورت مشاهده موردی مشکل‌دار یا نامفهوم، لطفا آن را گزارش دهید.
      </p>

      <form class="mt-4 space-y-3" @submit.prevent="submitReport">
        <textarea
          v-model="desc"
          class="h-28 w-full resize-none rounded-lg border border-gray-default bg-white p-3 text-sm outline-none transition-colors placeholder:text-text-passive/60 focus:border-primary-500"
          :class="{ 'border-red-500! focus:border-red-500!': !!descError }"
          placeholder="متن گزارش را بنویسید، شفاف و واضح وارد کنید"
          maxlength="500"
          @blur="touched = true"
          @input="validateDesc"
        />
        <p v-if="descError" class="text-xs text-red-500">{{ descError }}</p>
        <p class="text-left text-[10px] text-text-passive">{{ desc.length }}/500</p>

        <div class="flex items-center justify-end">
          <button type="submit" class="btn btn-primary btn-sm px-4">
            <Icon name="material-symbols:chevron-left" size="14" />
              ارسال گزارش
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    targetId?: string | number
    type?: string
    width?: number
  }>(),
  {
    type: 'job',
    width: 620,
  },
)

const dialogRef = ref<HTMLDialogElement | null>(null)
const desc = ref('')
const loading = ref(false)
const touched = ref(false)

const api = useApi()
const { $toast } = useNuxtApp()

const canSubmit = computed(() => {
  return !loading.value && Boolean(props.targetId) && desc.value.trim().length > 0
})

const descError = computed(() => {
  if (!touched.value) return ''
  if (!desc.value.trim()) return 'لطفا متن گزارش را وارد کنید'
  return ''
})

function showModal() {
  dialogRef.value?.showModal()
}

function closeModal() {
  dialogRef.value?.close()
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function validateDesc() {
  if (!touched.value) return
  // `descError` is computed and recalculates automatically.
}

async function submitReport() {
  touched.value = true
  if (!canSubmit.value) return

  loading.value = true
  try {
    await api.post('/reports', {
      desc: desc.value.trim(),
      type: props.type,
      id: props.targetId,
    })

    $toast.success('گزارش شما ثبت شد')
    desc.value = ''
    touched.value = false
    closeModal()
  } catch (error: any) {
    $toast.error(error?.message || 'ثبت گزارش با خطا مواجه شد')
  } finally {
    loading.value = false
  }
}

defineExpose({
  showModal,
  closeModal,
})
</script>
