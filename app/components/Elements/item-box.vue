<template>
  <div class="bg-white p-1 rounded-lg">
    <div class="bg-[#F6F8FE] rounded-lg p-3">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <div class="flex justify-center items-center bg-[#ECF4D9] rounded-2xl">
            <img
              :src="item.company_logo || ''"
              alt=""
              class="w-[64px] h-[64px] object-cover rounded-2xl"
            />
          </div>
          <div class="text-sm">
            <p class="font-semibold">
              {{ variant === 'project' ? `پروژه ${project.type}` : ad.title }}
            </p>
            <div class="flex flex-wrap items-center mt-2">
              <Icon name="svg:buildings-4" />
              <p class="text-text-passive">نام شرکت:</p>
              <p class="mr-1" :title="companyName.length > 24 ? companyName : undefined">
                {{ truncatedCompanyName }}
              </p>
            </div>
          </div>
        </div>
        <div class="text-center">
          <Icon
            name="svg:bookmark"
            class="cursor-pointer"
            @click="emit('bookmark', item.id, variant === 'project' ? 'Project' : 'Ad')"
          />
          <p
            v-if="variant === 'ad' && ad.publish_date"
            class="text-xs text-text-passive"
          >
            {{ formatRelativeDate(ad.publish_date) }}
          </p>
        </div>
      </div>

      <div
        class="flex text-sm mt-3 overflow-x-auto no-scrollbar"
        :class="variant === 'project' ? 'gap-2' : 'gap-1'"
      >
        <div
          v-if="variant === 'project'"
          class="shrink-0 border border-gray-default rounded-full bg-white py-1 px-3 flex items-center gap-2"
        >
          <Icon name="tabler:file-text" class="ma-auto text-[#B95C04]" />
          پروژه حسابداری
        </div>
        <div
          v-if="item.company?.activity"
          class="shrink-0 border border-gray-default rounded-full bg-white py-1 px-3 flex items-center gap-2"
        >
          <Icon name="ph:suitcase-simple-light" class="ma-auto" />
          {{ item.company.activity }}
        </div>
        <template v-if="variant === 'ad'">
          <div
            v-if="ad.category"
            class="shrink-0 border border-gray-default rounded-full bg-white py-1 px-3 flex items-center gap-2"
          >
            {{ ad.category }}
          </div>
          <div
            v-if="ad.province_name || ad.city_name"
            class="shrink-0 border border-gray-default rounded-full bg-white py-1 px-3 flex items-center gap-2"
          >
            <Icon name="svg:location-4" class="ma-auto" />
            {{ ad.province_name }}، {{ ad.city_name }}
          </div>
          <div
            v-if="ad.gender"
            class="shrink-0 border border-gray-default rounded-full bg-white py-1 px-3 flex items-center gap-2"
          >
            <Icon name="lucide:user" class="ma-auto" />
            {{ ad.gender }}
          </div>
        </template>
      </div>
    </div>

    <div class="flex items-center justify-between mt-2 px-2">
      <div>
        <p class="text-sm text-text-secondary">
          {{ variant === 'project' ? 'پروژه' : ad.employment_type }}
        </p>
        <p class="font-semibold">{{ footerValue }}</p>
      </div>
      <NuxtLink
        :to="`/ad/${item.id}`"
        class="btn border-none px-2 h-8 text-sm text-primary-500 bg-[#4864E114]"
      >
        <icons-chevron class="rotate-90" color="#4864e1" />
        مشاهده
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from 'moment-jalaali'
// import 'moment/locale/fa'
import type { AdList } from '~/types/ad'
import type { ProjectList } from '~/types/project'

moment.locale('fa')

const props = defineProps<{
  variant: 'ad' | 'project'
  item: AdList | ProjectList
}>()

const emit = defineEmits<{
  bookmark: [id: number | string, type: string]
}>()

const ad = computed(() => props.item as AdList)
const project = computed(() => props.item as ProjectList)

const companyName = computed(() => props.item.company_name || '')

const truncatedCompanyName = computed(() => {
  const limit = props.variant === 'project' ? 24 : 12
  return companyName.value.length > limit
    ? `${companyName.value.slice(0, limit)}…`
    : companyName.value
})

const footerValue = computed(() => {
  if (props.variant === 'project') {
    const min = project.value.min_budget ?? '-'
    const max = project.value.max_budget ?? '-'
    return `${min} - ${max}`
  }

  return ad.value.salary || '-'
})

function formatRelativeDate(date: string) {
  const parsed = /^\d{8}$/.test(date)
    ? moment(date, 'YYYYMMDD')
    : moment(date)

  return parsed.isValid() ? parsed.fromNow() : ''
}
</script>
