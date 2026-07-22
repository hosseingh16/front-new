<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>نوع فعالیت</Titr>

    <div class="mt-6 space-y-6">
      <div>
        <m-select2
          v-model="form.activity_type"
          label="نوع فعالیت:"
          required
          :options="activityOptions"
          placeholder="نوع فعالیت خود را انتخاب کنید"
          :error="Boolean(errors.activity_type)"
        />
        <p v-if="errors.activity_type" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.activity_type }}
        </p>
      </div>

      <div>
        <m-text-field
          v-model="form.desc"
          multiline
          label="شرح فعالیت:"
          required
          placeholder="شرح فعالیتی در باره کسب و کار خود بنویسید..."
          :error="Boolean(errors.desc)"
        />
        <div class="mt-1 flex items-center justify-between gap-3">
          <p v-if="errors.desc" class="text-xs text-[#EF4035]">
            {{ errors.desc }}
          </p>
          <p
            class="ms-auto text-xs"
            :class="
              form.desc.length > TAX_RETURN_DESC_MAX
                ? 'text-[#EF4035]'
                : 'text-text-passive'
            "
          >
            {{ form.desc.length }} / {{ TAX_RETURN_DESC_MAX }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import {
  TAX_RETURN_ACTIVITY_OPTIONS,
  TAX_RETURN_DESC_MAX,
  type TaxReturnFormErrors,
  type TaxReturnFormModel,
} from '~/types/tax-return-form'
import type { ISelectItem } from '~/types/select-item'

defineProps<{
  form: TaxReturnFormModel
  errors: TaxReturnFormErrors
}>()

const activityOptions: ISelectItem[] = TAX_RETURN_ACTIVITY_OPTIONS.map(
  (item) => ({
    label: item.label,
    value: item.value,
  }),
)
</script>
