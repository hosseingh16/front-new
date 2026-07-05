<template>
  <div
    ref="rootRef"
    class="relative mt-6 w-full"
    :class="
      showDropdown
        ? 'max-md:fixed max-md:inset-0 max-md:z-100 max-md:mt-0 max-md:flex max-md:flex-col max-md:bg-white max-md:px-4 max-md:pt-4 max-md:pb-0'
        : ''
    "
  >
    <div
      class="flex h-16 shrink-0 items-center rounded-lg border-4 border-surface-100 bg-white p-2"
      :class="showDropdown ? 'max-md:h-12 max-md:gap-2' : ''"
    >
      <icons-search-2 color="#D1D1D1" class="shrink-0" />
      <input
        ref="inputRef"
        v-model="keyword"
        type="text"
        class="mx-1 grow py-3 focus:outline-none placeholder:text-text-muted"
        placeholder="جستجوی عنوان‌ شغلی، سازمان یا نوع فعالیت ..."
        autocomplete="off"
        @focus="openDropdown"
        @keydown="onKeydown"
      />
      <button
        v-if="hasKeyword"
        type="button"
        class="max-md:hidden flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-passive transition-colors hover:bg-surface-100"
        aria-label="پاک کردن"
        @click="clearKeyword"
      >
        <Icon name="svg:close" size="16" />
      </button>
      <button
        v-if="showDropdown"
        type="button"
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-text-passive transition-colors hover:bg-surface-100 md:hidden"
        aria-label="بستن"
        @click="closeMobileSearch"
      >
        <Icon name="svg:close" size="18" />
      </button>
      <button
        type="button"
        class="btn max-md:hidden"
        :class="hasKeyword ? 'btn-success' : 'btn-disabled'"
        :disabled="!hasKeyword"
        @click="submitSearch"
      >
        <icons-search-2 :color="hasKeyword ? '#FFFFFF' : '#D1D1D1'" />
        جستجو
      </button>
    </div>

    <div
      v-if="showDropdown"
      class="z-50 flex min-h-0 flex-col overflow-hidden bg-white max-md:flex-1 md:absolute md:inset-x-0 md:top-[calc(100%+8px)] md:rounded-xl md:border md:border-surface-100 md:shadow-[0_12px_40px_rgba(18,18,18,0.12)]"
      @mousedown.prevent
    >
      <div class="shrink-0 border-b border-surface-100 py-3 max-md:border-t max-md:pt-4 md:p-2">
        <div
          class="flex gap-2 overflow-x-auto no-scrollbar md:gap-1 rounded-xl bg-surface-100 md:p-1 [&>.btn]:h-8 [&>.btn]:text-sm p-1"
        >
          <button
            v-for="tab in HOME_SEARCH_TABS"
            :key="tab.value"
            type="button"
            class="btn btn-ghost flex shrink-0 items-center gap-1.5 rounded-lg px-3 text-sm max-md:border max-md:px-4"
            :class="
              activeTab === tab.value
                ? 'bg-white text-text-primary shadow-sm max-md:border-surface-100'
                : 'bg-surface-100 text-text-passive max-md:border-transparent max-md:bg-transparent'
            "
            @mousedown.prevent
            @click="activeTab = tab.value"
          >
            <Icon
              v-if="tab.icon"
              :name="tab.icon"
              size="16"
              class="shrink-0"
            />
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-2 max-md:px-0 md:max-h-[420px]">
        <div v-if="loading" class="space-y-2 px-2 py-3">
          <div
            v-for="n in 4"
            :key="`skeleton-${n}`"
            class="flex items-center gap-3 rounded-lg px-3 py-3"
          >
            <div class="h-10 w-10 shrink-0 rounded-lg bg-surface-200 animate-pulse" />
            <div class="grow space-y-2">
              <div class="h-4 w-3/4 rounded bg-surface-200 animate-pulse" />
              <div class="h-3 w-1/2 rounded bg-surface-200 animate-pulse" />
            </div>
          </div>
        </div>

        <template v-else-if="activeTab === 'all'">
          <NoResult
            v-if="!items.length"
            v-bind="HOME_SEARCH_ALL_EMPTY"
            :icon-size="160"
            wrapper-class="py-8 max-md:py-12"
          />

          <section
            v-for="group in groupedItems"
            v-else
            :key="group.tab"
            class="mb-4 last:mb-0"
          >
            <HomeSearchSectionHeader
              :title="group.title"
              :icon="group.icon"
              :view-all-url="group.viewAllUrl"
              @view-all="closeDropdown"
            />

            <template v-if="group.items.length">
              <HomeSearchResultItem
                v-for="item in group.items"
                :key="`${group.tab}-${item.id}`"
                :item="item"
                :active="isItemHighlighted(item)"
                @select="selectItem"
              />
            </template>

            <NoResult
              v-else
              v-bind="HOME_SEARCH_EMPTY_STATE[group.tab]"
              :icon-size="120"
              wrapper-class="py-6 max-md:py-8"
            />
          </section>
        </template>

        <template v-else>
          <HomeSearchSectionHeader
            v-if="activeTabMeta"
            :title="activeTabMeta.label"
            :icon="activeTabMeta.icon"
            :view-all-url="viewAllPath(activeTab, debouncedKeyword)"
            @view-all="closeDropdown"
          />

          <NoResult
            v-if="!visibleItems.length"
            v-bind="HOME_SEARCH_EMPTY_STATE[activeTab]"
            :icon-size="120"
            wrapper-class="py-8 max-md:py-12"
          />

          <template v-else>
            <HomeSearchResultItem
              v-for="(item, index) in visibleItems"
              :key="`${item.tab}-${item.id}`"
              :item="item"
              :active="highlightedIndex === index"
              @select="selectItem"
            />
          </template>
        </template>
      </div>

      <div
        v-if="showDropdown"
        class="shrink-0 border-t border-surface-100 bg-white p-4 md:hidden"
      >
        <button
          type="button"
          class="btn btn-success w-full"
          :class="{ 'btn-disabled': !hasKeyword }"
          :disabled="!hasKeyword"
          @click="submitSearch"
        >
          <icons-search-2 :color="hasKeyword ? '#FFFFFF' : '#D1D1D1'" />
          جستجو
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeSearchResultItem from '~/components/Elements/HomeSearchResultItem.vue'
import HomeSearchSectionHeader from '~/components/Elements/HomeSearchSectionHeader.vue'
import NoResult from '~/components/Elements/NoResult.vue'
import {
  HOME_SEARCH_ALL_EMPTY,
  HOME_SEARCH_EMPTY_STATE,
  HOME_SEARCH_TABS,
} from '~/types/home-search'
import type { HomeSearchItem } from '~/types/home-search'

const {
  keyword,
  debouncedKeyword,
  activeTab,
  loading,
  items,
  visibleItems,
  groupedItems,
  flatSelectableItems,
  highlightedIndex,
  hasKeyword,
  showDropdown,
  openDropdown,
  closeDropdown,
  clearKeyword,
  selectItem,
  submitSearch,
  onKeydown,
  viewAllPath,
} = useHomeSearch()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const activeTabMeta = computed(() =>
  HOME_SEARCH_TABS.find((tab) => tab.value === activeTab.value),
)

function closeMobileSearch() {
  closeDropdown()
}

function isItemHighlighted(item: HomeSearchItem) {
  const highlighted = flatSelectableItems.value[highlightedIndex.value]
  if (!highlighted) return false
  return highlighted.id === item.id && highlighted.tab === item.tab
}

function handleClickOutside(event: MouseEvent) {
  if (window.innerWidth < 768) return
  if (!rootRef.value?.contains(event.target as Node)) {
    closeDropdown()
  }
}

function toggleBodyScroll(lock: boolean) {
  if (!import.meta.client || window.innerWidth >= 768) return
  document.body.style.overflow = lock ? 'hidden' : ''
}

watch(showDropdown, (open) => {
  toggleBodyScroll(open)
  if (open && import.meta.client && window.innerWidth < 768) {
    nextTick(() => inputRef.value?.focus())
  }
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  toggleBodyScroll(false)
})
</script>
