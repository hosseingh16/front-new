<template>
  <section id="section-location" class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>موقعیت مکانی سازمان</Titr>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div>
        <m-select2
          v-model="selectedProvince"
          label="استان:"
          required
          search
          :options="provinceOptions"
          placeholder="استان را انتخاب کنید"
          :error="Boolean(errors.province)"
        />
        <p v-if="errors.province" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.province }}
        </p>
      </div>

      <div>
        <m-select2
          v-model="selectedCity"
          label="شهر:"
          required
          search
          :options="cityOptions"
          placeholder="شهر را انتخاب کنید"
          :disabled="!form.province || citiesLoading"
          :error="Boolean(errors.city)"
        />
        <p v-if="errors.city" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.city }}
        </p>
      </div>

      <div>
        <m-select2
          v-model="selectedRegion"
          label="منطقه:"
          search
          :options="regionOptions"
          placeholder="منطقه را انتخاب کنید"
          :disabled="!form.city || regionsLoading || !hasRegions"
        />
      </div>

      <div class="lg:col-span-2">
        <m-text-field
          v-model="form.address"
          multiline
          label="آدرس دقیق:"
          required
          placeholder="آدرس دقیق سازمان را وارد کنید"
          :error="Boolean(errors.address)"
        />
        <p v-if="errors.address" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.address }}
        </p>
      </div>

      <div class="lg:col-span-2">
        <CompanyLocationMapPicker
          :lat="form.lat"
          :long="form.long"
          @select="onMapSelect"
        />
      </div>
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
import CompanyLocationMapPicker from './CompanyLocationMapPicker.vue'
import CompanySectionActions from './CompanySectionActions.vue'
import { provinces } from '~/feeders/provinces'
import type {
  CompanyProfileFormErrors,
  CompanyProfileFormModel,
} from '~/types/company-profile-form'
import type { ISelectItem } from '~/types/select-item'

const props = defineProps<{
  form: CompanyProfileFormModel
  errors: CompanyProfileFormErrors
  cityOptions: ISelectItem[]
  regionOptions: ISelectItem[]
  citiesLoading: boolean
  regionsLoading: boolean
  loadCities: (provinceId: number) => Promise<void>
  loadRegions: (cityId: number) => Promise<void>
  saving?: boolean
}>()

const emit = defineEmits<{
  save: []
  cancel: []
}>()

const provinceOptions = provinces
const hasRegions = computed(() => props.regionOptions.length > 0)

function onMapSelect(coords: { lat: number; long: number }) {
  props.form.lat = coords.lat
  props.form.long = coords.long
}

const selectedProvince = computed({
  get: () => props.form.province ?? undefined,
  set: async (value: string | number | undefined) => {
    const provinceId = value == null ? null : Number(value)
    props.form.province = provinceId
    props.form.province_name =
      provinceOptions.find((item) => item.value === provinceId)?.label ?? ''
    props.form.city = null
    props.form.city_name = ''
    props.form.region = null
    props.form.region_name = ''
    if (provinceId) await props.loadCities(provinceId)
  },
})

const selectedCity = computed({
  get: () => props.form.city ?? undefined,
  set: async (value: string | number | undefined) => {
    const cityId = value == null ? null : Number(value)
    props.form.city = cityId
    props.form.city_name =
      props.cityOptions.find((item) => item.value === cityId)?.label ?? ''
    props.form.region = null
    props.form.region_name = ''
    if (cityId) await props.loadRegions(cityId)
  },
})

const selectedRegion = computed({
  get: () => props.form.region ?? undefined,
  set: (value: string | number | undefined) => {
    const regionId = value == null ? null : Number(value)
    props.form.region = regionId
    props.form.region_name =
      props.regionOptions.find((item) => item.value === regionId)?.label ?? ''
  },
})
</script>
