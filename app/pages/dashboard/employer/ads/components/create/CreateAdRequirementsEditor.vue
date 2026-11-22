<template>
  <section class="overflow-visible rounded-2xl border border-gray-default bg-white p-4">
    <Titr>شرایط احراز</Titr>

    <p class="mt-4 text-sm leading-7 text-text-passive">
      شامل مهارت‌ها، ابزارهای خاص، مدرک تحصیلی و سایر شرایط مورد نیاز برای این
      موقعیت شغلی را وارد کنید.
    </p>

    <div class="relative z-10 mt-4">
      <m-tiny-mce-editor
        v-model="form.job_description"
        headings
        :max-length="adsResumeTermsMaxLength"
        placeholder="شرایط احراز را بنویسید..."
      />
      <div class="mt-1 flex items-start justify-between gap-3">
        <p v-if="errors.job_description" class="text-xs text-[#EF4035]">
          {{ errors.job_description }}
        </p>
        <p
          class="ms-auto shrink-0 text-xs"
          :class="isOverLimit ? 'text-[#EF4035]' : 'text-text-passive'"
        >
          {{ characterCount.toLocaleString('fa-IR') }} /
          {{ adsResumeTermsMaxLength.toLocaleString('fa-IR') }} کاراکتر
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type { CreateAdFormErrors, CreateAdFormModel } from '~/types/create-ad-form'
import { getResumeTermsPlainLength } from '~/utils/create-ad-payload'

const props = defineProps<{
  form: CreateAdFormModel
  errors: CreateAdFormErrors
}>()

const { adsResumeTermsMaxLength } = useSettings()

const characterCount = computed(() =>
  getResumeTermsPlainLength(props.form.job_description),
)
const isOverLimit = computed(
  () => characterCount.value > adsResumeTermsMaxLength.value,
)
</script>
