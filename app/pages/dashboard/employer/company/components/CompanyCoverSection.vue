<template>
  <section id="section-cover" class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>عکس سرصفحه</Titr>

    <p class="mt-4 text-sm leading-7 text-text-passive">
      این تصویر در بالای پروفایل سازمان شما نمایش داده می‌شود.
    </p>

    <div v-if="form.cover" class="mt-4">
      <img
        :src="form.cover"
        alt="عکس سرصفحه سازمان"
        class="h-48 w-full rounded-lg border border-gray-default object-cover"
      />
      <button
        type="button"
        class="btn btn-error btn-outline mt-3 h-9 text-sm"
        @click="form.cover = ''"
      >
        حذف تصویر
      </button>
    </div>

    <div v-else class="mt-4">
      <CompanyImageUpload @select="(file) => emit('upload', file)" />
    </div>

    <CompanySectionActions
      :saving="saving"
      @save="emit('save')"
      @cancel="emit('cancel')"
    />
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import CompanyImageUpload from './CompanyImageUpload.vue'
import CompanySectionActions from './CompanySectionActions.vue'
import type { CompanyProfileFormModel } from '~/types/company-profile-form'

defineProps<{
  form: CompanyProfileFormModel
  saving?: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
  upload: [file: File]
}>()
</script>
