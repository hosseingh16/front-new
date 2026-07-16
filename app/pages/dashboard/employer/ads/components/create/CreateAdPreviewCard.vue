<template>
  <section class="rounded-2xl border border-gray-default bg-white p-4">
    <Titr :with-icon="false">پیش‌نمایش کارت</Titr>

    <div class="mt-6 rounded-lg bg-white p-1 shadow-sm">
      <div class="rounded-lg bg-[#F6F8FE] p-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECF4D9]">
              <img
                v-if="companyLogo"
                :src="companyLogo"
                alt=""
                class="h-full w-full rounded-2xl object-cover"
              />
              <Icon v-else name="svg:buildings-4" size="28" />
            </div>
            <div class="text-sm">
              <p class="font-semibold text-text-tertiary">
                {{ titleLabel }}
              </p>
              <div class="mt-2 flex flex-wrap items-center gap-1 text-text-passive">
                <Icon name="svg:buildings-4" />
                <span>نام شرکت:</span>
                <span class="mr-1 text-text-secondary">{{ companyName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-3 flex flex-wrap gap-1 overflow-x-auto text-sm no-scrollbar">
          <div
            v-if="locationLabel"
            class="flex shrink-0 items-center gap-2 rounded-full border border-gray-default bg-white px-3 py-1"
          >
            <Icon name="svg:location-4" class="shrink-0" />
            <span>{{ locationLabel }}</span>
          </div>
          <div
            v-if="genderLabel"
            class="flex shrink-0 items-center gap-2 rounded-full border border-gray-default bg-white px-3 py-1"
          >
            <Icon name="lucide:user" class="shrink-0" />
            <span>{{ genderLabel }}</span>
          </div>
        </div>
      </div>

      <div class="mt-2 flex items-center justify-between px-2 pb-2">
        <div>
          <p class="text-sm text-text-secondary">
            {{ employmentTypeLabel || 'نوع همکاری' }}
          </p>
          <p class="font-semibold text-text-tertiary">
            {{ salaryRangeLabel || 'حقوق توافقی' }}
          </p>
        </div>
        <button
          type="button"
          class="btn btn-outline h-8 px-2 text-primary-500"
          disabled
        >
          <span class="text-sm">مشاهده</span>
          <Icon name="svg:arrow-left-circle" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type { CreateAdFormModel } from '~/types/create-ad-form'
import type { ISelectItem } from '~/types/select-item'

const props = defineProps<{
  form: CreateAdFormModel
  companyName: string
  companyLogo: string
  jobTitles: ISelectItem[]
  employmentTypes: ISelectItem[]
  genders: ISelectItem[]
  salaryRanges: ISelectItem[]
}>()

function resolveLabel(
  options: ISelectItem[],
  value: string | number | null | undefined,
) {
  if (value == null || value === '') return ''
  const match = options.find((item) => String(item.value) === String(value))
  return match?.label ?? ''
}

const titleLabel = computed(() => {
  if (props.form.title) {
    const fromLookup = props.jobTitles.find(
      (item) => String(item.value) === String(props.form.title),
    )
    return fromLookup?.label ?? props.form.title
  }
  return 'استخدام حسابدار'
})

const employmentTypeLabel = computed(() =>
  resolveLabel(props.employmentTypes, props.form.employment_type),
)

const genderLabel = computed(() =>
  resolveLabel(props.genders, props.form.gender),
)

const salaryRangeLabel = computed(() =>
  resolveLabel(props.salaryRanges, props.form.salary_range),
)

const locationLabel = computed(() => {
  if (props.form.province_name && props.form.city_name) {
    return `${props.form.province_name}، ${props.form.city_name}`
  }
  return props.form.city_name || props.form.province_name || ''
})
</script>
