<template>
  <div class="w-full min-w-0">
    <div
      class="-mx-4 flex w-auto min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain px-4 pb-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
      dir="rtl"
    >
      <button
        type="button"
        class="flex h-9 shrink-0 items-center gap-2 rounded-full border bg-white px-3.5 text-sm font-semibold whitespace-nowrap transition-colors"
        :class="mainFilterChipClass"
        aria-label="همه فیلترها"
        @click="openAllFilters"
      >
        <Icon name="svg:filter" size="16" class="shrink-0" />
        <span>فیلتر</span>
        <span
          v-if="filters.activeFilterCount > 0"
          class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e4ebfc] px-1 text-xs font-semibold leading-none text-primary-500"
        >
          {{ toPersianDigits(filters.activeFilterCount) }}
        </span>
      </button>

      <button
        v-for="(section, index) in AD_REQUEST_FILTER_SECTIONS"
        :key="section.title"
        type="button"
        class="flex h-9 shrink-0 items-center gap-1.5 rounded-full border bg-white px-3.5 text-sm font-semibold whitespace-nowrap transition-colors"
        :class="chipButtonClass(index)"
        @click="openSection(index)"
      >
        <span class="max-w-[120px] truncate">{{ chipLabel(index, section.title) }}</span>
        <Icon
          name="svg:chevron-down"
          size="12"
          class="shrink-0 text-text-passive transition-transform"
          :class="{ 'rotate-180 text-primary-500': activeSection === index }"
        />
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="activeSection !== null"
        class="fixed inset-0 z-100 md:hidden"
        @keydown.escape="closeSection"
      >
        <div class="absolute inset-0 bg-black/40" @click="closeSection" />
        <div
          class="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col rounded-t-2xl bg-white"
          dir="rtl"
        >
          <div class="flex flex-row-reverse items-center justify-between border-b border-gray-default px-4 py-4">
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary"
              aria-label="بستن"
              @click="closeSection"
            >
              <Icon name="svg:close" size="20" />
            </button>
            <h3 class="text-base font-yb-bold text-text-tertiary">
              {{ sectionTitle(activeSection) }}
            </h3>
          </div>

          <div class="flex-1 overflow-y-auto px-4 py-4 text-sm text-text-tertiary">
            <AdRequestFilterSectionContent :section-index="activeSection" />
          </div>

          <div class="border-t border-gray-default p-4">
            <button
              type="button"
              class="btn btn-primary h-11 w-full rounded-lg text-sm font-yb-bold"
              @click="closeSection"
            >
              مشاهده نتایج
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="allFiltersOpen"
        class="fixed inset-0 z-100 flex flex-col bg-white md:hidden"
        dir="rtl"
        @keydown.escape="closeAllFilters"
      >
        <div class="flex flex-row-reverse items-center justify-between border-b border-gray-default px-4 py-4">
          <button
            v-if="allFiltersView === 'detail'"
            type="button"
            class="flex items-center gap-1 text-sm font-semibold text-text-tertiary"
            @click="allFiltersView = 'list'"
          >
            <span>بازگشت</span>
            <Icon name="svg:chevron-down" size="12" class="rotate-90" />
          </button>
          <button
            v-else
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary"
            aria-label="بستن"
            @click="closeAllFilters"
          >
            <Icon name="svg:close" size="20" />
          </button>

          <div class="flex items-center gap-3">
            <h2 class="text-base font-yb-bold text-primary-500">
              {{ allFiltersView === 'list' ? 'فیلترها' : sectionTitle(detailSectionIndex!) }}
            </h2>

            <button
              v-if="allFiltersView === 'list' && filters.activeFilterCount > 0"
              type="button"
              class="text-sm font-semibold text-[#dd4a48]"
              @click="filters.clearFilters()"
            >
              حذف فیلترها
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-4">
          <template v-if="allFiltersView === 'list'">
            <div
              v-for="(section, index) in AD_REQUEST_FILTER_SECTIONS"
              :key="section.title"
              class="flex flex-row-reverse cursor-pointer items-center justify-between border-b border-gray-default py-4"
              @click="openAllFiltersDetail(index)"
            >
              <Icon name="svg:chevron-down" size="12" class="rotate-90 text-text-passive" />
              <span class="font-semibold text-text-tertiary">{{ section.title }}</span>
            </div>
          </template>

          <div v-else class="py-4 text-sm text-text-tertiary">
            <AdRequestFilterSectionContent :section-index="detailSectionIndex!" />
          </div>
        </div>

        <div class="border-t border-gray-default p-4">
          <button
            type="button"
            class="btn btn-primary h-11 w-full rounded-lg text-sm font-yb-bold"
            @click="closeAllFilters"
          >
            مشاهده نتایج
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import AdRequestFilterSectionContent from '~/components/Elements/AdRequestFilterSectionContent.vue'
import { toPersianDigits } from '~/composables/useCountUp'
import { EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY } from '~/composables/employer-ad-request-filters-context'
import { AD_REQUEST_FILTER_SECTIONS } from '~/types/employer-ad-request'

const filters = (() => {
  const ctx = inject(EMPLOYER_AD_REQUEST_FILTERS_INJECTION_KEY)
  if (!ctx) {
    throw new Error('AdRequestFiltersMobile must be used within a filters provider')
  }
  return ctx
})()

const activeChipClass = 'border-primary-500 text-primary-500'
const inactiveChipClass = 'border-gray-200 text-text-tertiary'

const mainFilterChipClass = computed(() =>
  allFiltersOpen.value || filters.activeFilterCount > 0
    ? activeChipClass
    : inactiveChipClass,
)

const activeSection = ref<number | null>(null)
const allFiltersOpen = ref(false)
const allFiltersView = ref<'list' | 'detail'>('list')
const detailSectionIndex = ref<number | null>(null)

function sectionTitle(index: number) {
  return AD_REQUEST_FILTER_SECTIONS[index]?.title ?? ''
}

function chipButtonClass(sectionIndex: number) {
  if (activeSection.value === sectionIndex || chipHasSelection(sectionIndex)) {
    return activeChipClass
  }
  return inactiveChipClass
}

function chipHasSelection(sectionIndex: number) {
  switch (sectionIndex) {
    case 0:
      return filters.selectedStatuses.length !== filters.statusOptions.length
    case 1:
      return filters.selectedExperiences.length > 0
    case 2:
      return filters.selectedGender != null
    default:
      return false
  }
}

function chipLabel(sectionIndex: number, title: string) {
  if (!chipHasSelection(sectionIndex)) return title

  if (sectionIndex === 1 && filters.selectedExperiences.length) {
    const option = filters.experienceOptions.find((item) =>
      filters.selectedExperiences.some(
        (value) => String(value) === String(item.value),
      ),
    )
    return option?.label ?? title
  }

  if (sectionIndex === 2 && filters.selectedGender != null) {
    const option = filters.genderOptions.find(
      (item) => String(item.value) === String(filters.selectedGender),
    )
    return option?.label ?? title
  }

  if (sectionIndex === 0) {
    const selected = filters.statusOptions.filter((item) =>
      filters.isStatusSelected(item.value),
    )
    return selected[0]?.label ?? title
  }

  return title
}

function openSection(index: number) {
  if (activeSection.value === index) {
    closeSection()
    return
  }
  activeSection.value = index
  lockBodyScroll(true)
}

function closeSection() {
  activeSection.value = null
  if (!allFiltersOpen.value) lockBodyScroll(false)
}

function openAllFilters() {
  allFiltersOpen.value = true
  allFiltersView.value = 'list'
  detailSectionIndex.value = null
  lockBodyScroll(true)
}

function openAllFiltersDetail(index: number) {
  allFiltersView.value = 'detail'
  detailSectionIndex.value = index
}

function closeAllFilters() {
  allFiltersOpen.value = false
  allFiltersView.value = 'list'
  detailSectionIndex.value = null
  activeSection.value = null
  lockBodyScroll(false)
}

function lockBodyScroll(lock: boolean) {
  document.body.style.overflow = lock ? 'hidden' : ''
}

onUnmounted(() => {
  lockBodyScroll(false)
})
</script>
