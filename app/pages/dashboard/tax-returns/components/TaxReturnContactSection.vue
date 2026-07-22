<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <div class="flex items-center justify-between gap-3">
      <Titr>اطلاعات هویتی و تماس</Titr>

      <div class="flex items-center gap-3">
        <button
          v-if="!editing"
          type="button"
          class="flex items-center gap-1 text-sm font-semibold text-primary-500 transition-opacity hover:opacity-80"
          @click="emit('edit')"
        >
          <Icon name="lucide:pencil" size="16" />
          ویرایش
        </button>
        <button
          v-if="!editing && !form.email"
          type="button"
          class="flex items-center gap-1 text-sm font-semibold text-[#009F65] transition-opacity hover:opacity-80"
          @click="emit('edit')"
        >
          <Icon name="lucide:plus" size="16" />
          افزودن
        </button>
        <button
          v-if="editing"
          type="button"
          class="text-sm font-semibold text-text-passive transition-opacity hover:opacity-80"
          @click="emit('done')"
        >
          تایید
        </button>
      </div>
    </div>

    <div v-if="!editing" class="mt-6 grid gap-6 sm:grid-cols-2">
      <div>
        <p class="text-sm text-text-passive">شماره تماس همراه:</p>
        <p class="mt-2 font-semibold text-text-tertiary">
          {{ form.cellphone || 'داده ای وارد نشده است' }}
        </p>
      </div>
      <div>
        <p class="text-sm text-text-passive">پست الکترونیکی:</p>
        <p
          class="mt-2 font-semibold"
          :class="form.email ? 'text-text-tertiary' : 'text-text-muted'"
        >
          {{ form.email || 'داده ای وارد نشده است' }}
        </p>
      </div>
    </div>

    <div v-else class="mt-6 grid gap-6 sm:grid-cols-2">
      <div>
        <m-text-field
          v-model="form.cellphone"
          label="شماره تماس همراه:"
          placeholder="شماره موبایل را وارد کنید"
          :error="Boolean(errors.cellphone)"
        />
        <p v-if="errors.cellphone" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.cellphone }}
        </p>
      </div>
      <div>
        <m-text-field
          v-model="form.email"
          label="پست الکترونیکی:"
          placeholder="ایمیل را وارد کنید"
          :error="Boolean(errors.email)"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.email }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type {
  TaxReturnFormErrors,
  TaxReturnFormModel,
} from '~/types/tax-return-form'

defineProps<{
  form: TaxReturnFormModel
  errors: TaxReturnFormErrors
  editing: boolean
}>()

const emit = defineEmits<{
  edit: []
  done: []
}>()
</script>
