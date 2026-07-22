<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <div class="flex items-center justify-between gap-3">
      <Titr>اطلاعات هویتی و تماس</Titr>
    </div>

    
    <div class="mt-6 grid gap-6 sm:grid-cols-2">
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
      <!-- <div>
        <m-text-field
          v-model="form.email"
          label="پست الکترونیکی:"
          placeholder="ایمیل را وارد کنید"
          :error="Boolean(errors.email)"
        />
        <p v-if="errors.email" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.email }}
        </p>
      </div> -->
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import type {
  TaxReturnFormErrors,
  TaxReturnFormModel,
} from "~/types/tax-return-form";

defineProps<{
  form: TaxReturnFormModel;
  errors: TaxReturnFormErrors;
  editing: boolean;
}>();

const emit = defineEmits<{
  edit: [];
  done: [];
}>();
</script>
