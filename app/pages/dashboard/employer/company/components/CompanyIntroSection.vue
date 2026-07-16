<template>
  <section id="section-intro" class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>معرفی سازمان</Titr>

    <div class="mt-6">
      <m-text-field
        v-model="form.intro"
        multiline
        label="معرفی سازمان:"
        required
        placeholder="سازمان خود، حوزه فعالیت، فرهنگ سازمانی و افتخارات آن را معرفی کنید."
        :error="Boolean(errors.intro)"
      />
      <p v-if="errors.intro" class="mt-1 text-xs text-[#EF4035]">
        {{ errors.intro }}
      </p>
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
import CompanySectionActions from './CompanySectionActions.vue'
import type {
  CompanyProfileFormErrors,
  CompanyProfileFormModel,
} from '~/types/company-profile-form'

defineProps<{
  form: CompanyProfileFormModel
  errors: CompanyProfileFormErrors
  saving?: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
}>()
</script>
