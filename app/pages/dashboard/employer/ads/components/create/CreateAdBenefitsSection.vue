<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>مزایای سازمان</Titr>

    <FilterCheckboxList
      v-model="form.company_advantages"
      :options="benefits"
      variant="card"
      list-class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    />
  </section>
</template>

<script setup lang="ts">
import FilterCheckboxList from "~/components/Elements/FilterCheckboxList.vue";
import Titr from "~/features/panel/cv/Titr.vue";
import type { CreateAdFormModel } from "~/types/create-ad-form";
import type { ISelectItem } from "~/types/select-item";

defineProps<{
  form: CreateAdFormModel;
  benefits: ISelectItem[];
}>();
</script>
