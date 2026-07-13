<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr>فیلدهای عمومی</Titr>

    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <div class="lg:col-span-2">
        <m-select2
          v-model="form.title"
          label="عنوان شغلی:"
          required
          :options="jobTitles"
          placeholder="عنوان شغلی را انتخاب کنید"
          :error="Boolean(errors.title)"
        />
        <p v-if="errors.title" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.title }}
        </p>
      </div>

      <div class="lg:col-span-2">
        <p class="mb-2 text-base">آدرس:</p>
        <button
          type="button"
          class="mb-3 text-sm font-semibold text-primary-500"
        >
          + آدرس جدید
        </button>
        <p class="mb-3 text-sm leading-7 text-text-passive">
          آدرس از پروفایل سازمان شما دریافت می‌شود. در صورت نیاز می‌توانید آدرس
          دیگری انتخاب کنید.
        </p>
        <label
          class="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-default bg-surface-50 p-3"
        >
          <input
            v-model="form.company_address"
            type="radio"
            class="radio radio-primary mt-1"
            :value="defaultAddress"
          />
          <span class="text-sm text-text-secondary">{{ defaultAddress }}</span>
        </label>
      </div>

      <div>
        <m-select2
          v-model="selectedProvince"
          label="استان:"
          :options="provinceOptions"
          placeholder="استان را انتخاب کنید"
        />
      </div>

      <div>
        <m-select2
          v-model="selectedCity"
          label="شهر:"
          :options="cityOptions"
          placeholder="شهر را انتخاب کنید"
          :disabled="!form.province || citiesLoading"
        />
      </div>

      <div>
        <m-select2
          v-model="form.employment_type"
          label="نوع همکاری:"
          required
          :options="employmentTypes"
          placeholder="نوع همکاری را انتخاب کنید"
          :error="Boolean(errors.employment_type)"
        />
        <p v-if="errors.employment_type" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.employment_type }}
        </p>
      </div>

      <div>
        <p class="mb-2 text-base">جنسیت:</p>
        <m-toggle
          v-model="form.gender"
          same-width
          :items="genderItems"
        />
      </div>

      <div>
        <m-select2
          v-model="selectedExperience"
          label="سابقه کار:"
          required
          :options="experienceLevels"
          placeholder="سابقه کار را انتخاب کنید"
        />
      </div>

      <div>
        <m-select2
          v-model="form.salary_range"
          label="حقوق:"
          :options="salaryRanges"
          placeholder="محدوده حقوق را انتخاب کنید"
        />
      </div>

      <div>
        <m-select2
          v-model="form.minimum_degree"
          label="حداقل مدرک تحصیلی:"
          :options="educationLevels"
          placeholder="مدرک تحصیلی را انتخاب کنید"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import { provinces } from '~/feeders/provinces'
import type { CreateAdFormErrors, CreateAdFormModel } from '~/types/create-ad-form'
import type { ISelectItem } from '~/types/select-item'

const props = defineProps<{
  form: CreateAdFormModel
  errors: CreateAdFormErrors
  jobTitles: ISelectItem[]
  employmentTypes: ISelectItem[]
  experienceLevels: ISelectItem[]
  salaryRanges: ISelectItem[]
  educationLevels: ISelectItem[]
  genders: ISelectItem[]
  cityOptions: ISelectItem[]
  citiesLoading: boolean
  loadCities: (provinceId: number) => Promise<void>
}>()

const defaultAddress = 'خراسان رضوی، مشهد، پیمان آید'

const provinceOptions = provinces

const genderItems = computed(() => {
  if (props.genders.length) {
    return props.genders.map((item) => ({
      title: item.label,
      value: String(item.value),
    }))
  }

  return [
    { title: 'زن', value: 'زن' },
    { title: 'مرد', value: 'مرد' },
    { title: 'در هر دو حالت', value: 'مهم نیست' },
  ]
})

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

const selectedExperience = computed({
  get: () => props.form.minimum_work_experience ?? undefined,
  set: (value: string | number | undefined) => {
    props.form.minimum_work_experience =
      value == null || value === '' ? null : Number(value)
  },
})

watch(
  () => props.form.company_address,
  (value) => {
    if (!value) props.form.company_address = defaultAddress
  },
  { immediate: true },
)
</script>
