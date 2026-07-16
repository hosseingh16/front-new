<template>
  <section id="section-visibility" class="rounded-2xl border border-gray-default bg-white p-4">
    <div class="flex items-center justify-between gap-4">
      <div>
        <Titr>تمایل رویت برای همه</Titr>
        <p class="mt-2 text-sm leading-7 text-text-passive">
          در صورت فعال بودن، پروفایل شما در نتیجه جستجو، مستقیما قابل رویت
          خواهد بود.
        </p>
      </div>

      <input
        v-model="form.is_profile_public"
        type="checkbox"
        class="toggle toggle-primary shrink-0"
        :disabled="saving"
        @change="emit('save')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type { CompanyProfileFormModel } from '~/types/company-profile-form'

defineProps<{
  form: CompanyProfileFormModel
  saving?: boolean
}>()

const emit = defineEmits<{
  save: []
}>()
</script>
