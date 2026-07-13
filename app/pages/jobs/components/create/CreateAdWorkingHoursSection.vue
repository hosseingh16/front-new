<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>ساعت کاری</Titr>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <m-text-field
          v-model="form.work_schedule"
          label="ساعت و روز کاری:"
          placeholder="مثال: شنبه تا چهارشنبه ۸ تا ۱۶"
        />
      </div>

      <div>
        <m-text-field
          v-model="form.travel_need"
          label="میزان سفر کاری مورد نیاز:"
          placeholder="مثال: گاهی اوقات"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type { CreateAdFormModel } from '~/types/create-ad-form'

defineProps<{
  form: CreateAdFormModel
}>()
</script>
