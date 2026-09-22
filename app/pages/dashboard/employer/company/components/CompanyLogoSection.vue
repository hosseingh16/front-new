<template>
  <section id="section-logo" class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>لوگو سازمان</Titr>

    <div class="mt-6">
      <div v-if="form.logo?.url" class="mb-3 flex items-center gap-4">
        <button
          type="button"
          class="relative shrink-0 cursor-pointer rounded-2xl disabled:cursor-wait"
          aria-label="تغییر لوگو"
          :disabled="logoUploading"
          @click="logoUpload?.open()"
        >
          <img
            :src="form.logo.url"
            alt=""
            class="h-20 w-20 rounded-2xl border border-gray-default object-cover"
            :class="logoUploading ? 'opacity-40' : ''"
          />
          <span
            v-if="logoUploading"
            class="absolute inset-0 flex items-center justify-center"
          >
            <span class="loading loading-spinner loading-sm text-primary-500" />
          </span>
        </button>
        <button
          type="button"
          class="btn btn-error btn-outline h-9 text-sm"
          :disabled="logoUploading"
          @click="emit('remove-logo')"
        >
          حذف لوگو
        </button>
      </div>
      <div :class="logoUploading ? 'pointer-events-none opacity-60' : ''">
        <CompanyImageUpload
          ref="logoUpload"
          :hide-dropzone="Boolean(form.logo?.url)"
          :accept="['jpg', 'jpeg', 'png', 'webp', 'gif']"
          @select="(file) => emit('upload-logo', file)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import CompanyImageUpload from './CompanyImageUpload.vue'
import type { CompanyProfileFormModel } from '~/types/company-profile-form'

defineProps<{
  form: CompanyProfileFormModel
  logoUploading?: boolean
}>()

const emit = defineEmits<{
  'upload-logo': [file: File]
  'remove-logo': []
}>()

const logoUpload = ref<{ open: () => void } | null>(null)
</script>
