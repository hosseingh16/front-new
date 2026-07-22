<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>محدوده کسب و کار</Titr>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <m-select2
          v-model="selectedProvince"
          label="استان محل کسب و کار:"
          required
          search
          :options="provinceOptions"
          placeholder="لطفا استان محل کسب و کار خود را انتخاب کنید"
          :error="Boolean(errors.province)"
        />
        <p v-if="errors.province" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.province }}
        </p>
      </div>

      <div>
        <m-select2
          v-model="selectedCity"
          label="شهر محل کسب و کار:"
          required
          search
          :options="cityOptions"
          placeholder="لطفا شهر محل کسب و کار خود را انتخاب کنید"
          :disabled="form.province == null || citiesLoading"
          :error="Boolean(errors.city)"
        />
        <p v-if="errors.city" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.city }}
        </p>
      </div>

      <div class="lg:col-span-2">
        <CompanyLocationMapPicker
          :lat="form.lat"
          :long="form.long"
          @select="emit('select', $event)"
        />
        <p v-if="errors.location" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.location }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import CompanyLocationMapPicker from '~/pages/dashboard/employer/company/components/CompanyLocationMapPicker.vue'
import { provinces } from '~/feeders/provinces'
import type {
  TaxReturnFormErrors,
  TaxReturnFormModel,
} from '~/types/tax-return-form'
import type { ISelectItem } from '~/types/select-item'

const props = defineProps<{
  form: TaxReturnFormModel
  errors: TaxReturnFormErrors
  cityOptions: ISelectItem[]
  citiesLoading: boolean
  loadCities: (provinceId: number) => Promise<void>
}>()

const emit = defineEmits<{
  select: [coords: { lat: number; long: number }]
}>()

const provinceOptions = provinces

const selectedProvince = computed({
  get: () => props.form.province ?? undefined,
  set: async (value: string | number | undefined) => {
    const provinceId = value == null ? null : Number(value)
    props.form.province = provinceId
    props.form.province_name =
      provinceOptions.find((item) => item.value === provinceId)?.label ?? ''
    props.form.city = null
    props.form.city_name = ''
    if (provinceId) await props.loadCities(provinceId)
  },
})

const selectedCity = computed({
  get: () => props.form.city ?? undefined,
  set: (value: string | number | undefined) => {
    const cityId = value == null ? null : Number(value)
    props.form.city = cityId
    props.form.city_name =
      props.cityOptions.find((item) => item.value === cityId)?.label ?? ''
  },
})
</script>
