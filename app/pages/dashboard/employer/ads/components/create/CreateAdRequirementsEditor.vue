<template>
  <section class="overflow-visible rounded-2xl border border-gray-default bg-white p-4">
    <Titr>شرایط احراز</Titr>

    <p class="mt-4 text-sm leading-7 text-text-passive">
      شامل مهارت‌ها، ابزارهای خاص، مدرک تحصیلی و سایر شرایط مورد نیاز برای این
      موقعیت شغلی را وارد کنید.
    </p>

    <div class="relative z-10 mt-4">
      <m-tiny-mce-editor
        v-model="form.resume_terms"
        placeholder="شرایط احراز را بنویسید..."
      />
      <p v-if="errors.resume_terms" class="mt-1 text-xs text-[#EF4035]">
        {{ errors.resume_terms }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type { CreateAdFormErrors, CreateAdFormModel } from '~/types/create-ad-form'

defineProps<{
  form: CreateAdFormModel
  errors: CreateAdFormErrors
}>()
</script>
