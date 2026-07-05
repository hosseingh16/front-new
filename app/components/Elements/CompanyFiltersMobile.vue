<template>
  <div class="w-full min-w-0">
    <div
      class="-mx-5 flex w-auto min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain px-5 pb-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
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
          v-if="activeFilterCount > 0"
          class="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e4ebfc] px-1 text-xs font-semibold leading-none text-primary-500"
        >
          {{ toPersianDigits(activeFilterCount) }}
        </span>
      </button>

      <button
        v-for="(section, index) in COMPANY_FILTER_SECTIONS"
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
        <div
          class="absolute inset-0 bg-black/40"
          @click="closeSection"
        />
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
            <CompanyFilterSectionContent :section-index="activeSection" />
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
              {{ allFiltersView === 'list' ? 'فیلتر شرکت‌ها' : sectionTitle(detailSectionIndex!) }}
            </h2>

            <button
              v-if="allFiltersView === 'list' && activeFilterCount > 0"
              type="button"
              class="text-sm font-semibold text-[#dd4a48]"
              @click="clearFilters()"
            >
              حذف فیلترها
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto px-4">
          <template v-if="allFiltersView === 'list'">
            <div
              v-for="(section, index) in COMPANY_FILTER_SECTIONS"
              :key="section.title"
              class="flex flex-row-reverse cursor-pointer items-center justify-between border-b border-gray-default py-4"
              @click="openAllFiltersDetail(index)"
            >
              <Icon name="svg:chevron-down" size="12" class="rotate-90 text-text-passive" />
              <span class="font-semibold text-text-tertiary">{{ section.title }}</span>
            </div>
          </template>

          <div v-else class="py-4 text-sm text-text-tertiary">
            <CompanyFilterSectionContent :section-index="detailSectionIndex!" />
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
import CompanyFilterSectionContent from '~/components/Elements/CompanyFilterSectionContent.vue'
import { toPersianDigits } from '~/composables/useCountUp'
import { COMPANY_FILTERS_INJECTION_KEY } from '~/composables/company-filters-context'
import { COMPANY_FILTER_SECTIONS } from '~/types/company-filters'

const filters = (() => {
  const ctx = inject(COMPANY_FILTERS_INJECTION_KEY)
  if (!ctx) {
    throw new Error('CompanyFiltersMobile must be used within a company filters provider')
  }
  return ctx
})()

const activeFilterCount = filters.activeFilterCount
const clearFilters = filters.clearFilters

const activeChipClass = 'border-primary-500 text-primary-500'
const inactiveChipClass = 'border-gray-200 text-text-tertiary'

const mainFilterChipClass = computed(() =>
  allFiltersOpen.value || activeFilterCount.value > 0
    ? activeChipClass
    : inactiveChipClass,
)

const activeSection = ref<number | null>(null)
const allFiltersOpen = ref(false)
const allFiltersView = ref<'list' | 'detail'>('list')
const detailSectionIndex = ref<number | null>(null)

function sectionTitle(index: number) {
  return COMPANY_FILTER_SECTIONS[index]?.title ?? ''
}

function chipButtonClass(sectionIndex: number) {
  if (activeSection.value === sectionIndex || chipHasSelection(sectionIndex)) {
    return activeChipClass
  }
  return inactiveChipClass
}

function chipHasSelection(sectionIndex: number) {
  const model = filters.model

  switch (sectionIndex) {
    case 0:
      return model.search.trim().length > 0
    case 1:
      return model.provinces.length > 0
    case 2:
      return model.activities.length > 0
    case 3:
      return model.sizes.length > 0
    case 4:
      return model.benefits.length > 0
    default:
      return false
  }
}

function chipLabel(sectionIndex: number, title: string) {
  if (!chipHasSelection(sectionIndex)) return title

  if (sectionIndex === 0) {
    return filters.model.search.trim()
  }

  const options = sectionOptions(sectionIndex)
  const selected = sectionSelectedValues(sectionIndex)
  const first = options.find((opt) =>
    selected.some((val) => String(val) === String(opt.value)),
  )
  return first?.label ?? title
}

function sectionOptions(sectionIndex: number) {
  return filters.sectionOptions(sectionIndex)
}

function sectionSelectedValues(sectionIndex: number) {
  const model = filters.model

  switch (sectionIndex) {
    case 1:
      return model.provinces
    case 2:
      return model.activities
    case 3:
      return model.sizes
    case 4:
      return model.benefits
    default:
      return []
  }
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
