<template>
  <section class="custom-pad relative pb-12" :class="sectionClass">
    <BackgroundPattern
      v-if="showPatterns"
      position="left"
      side="-3.75rem"
      top="25%"
    />
    <BackgroundPattern
      v-if="showPatterns"
      position="right"
      side="-3.75rem"
      top="66.666667%"
    />

    <div class="relative z-10 flex flex-col items-center">
      <h2 class="text-center font-yb-bold text-xl text-text-tertiary md:text-2xl">
        {{ title }}
      </h2>
      <p class="mt-3 text-center text-sm text-text-passive md:text-base">
        {{ subtitle }}
      </p>
    </div>

    <div
      class="relative z-10 mx-auto mt-8 grid max-w-xl grid-cols-2 gap-2 [&>.btn]:h-10 [&>.btn]:rounded-[8px] [&>.btn]:text-sm"
      :class="tabsClass"
    >
      <button
        v-for="category in categories"
        :key="category.id"
        class="btn"
        :class="
          faqType === category.id
            ? 'btn-primary'
            : 'btn-outline border-primary-200 bg-surface-50 text-primary-500'
        "
        @click="selectCategory(category.id)"
      >
        {{ category.label }}
      </button>
    </div>

    <div
      class="relative z-10 mx-auto mt-6 space-y-2"
      :class="listClass"
    >
      <div
        v-for="(item, index) in filteredItems"
        :key="item.question"
        class="cursor-pointer rounded-lg bg-surface-200 px-4 py-4 text-sm text-text-tertiary"
        @click="toggleItem(index)"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <Icon name="svg:plus" size="16" />
            <p class="font-light text-text-tertiary">{{ item.question }}</p>
          </div>
          <icons-chevron
            color="currentColor"
            class="shrink-0 transition-transform"
            :class="expandedIndex === index ? 'rotate-180' : ''"
          />
        </div>
        <div
          class="leading-7 text-text-passive transition-all"
          :class="expandedIndex === index ? 'mt-4 h-fit' : 'h-0 overflow-hidden'"
        >
          {{ item.answer }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface FaqCategory {
  id: number
  label: string
}

export interface FaqItem {
  type: number
  question: string
  answer: string
}

const props = withDefaults(
  defineProps<{
    categories: FaqCategory[]
    items: FaqItem[]
    title?: string
    subtitle?: string
    sectionClass?: string
    tabsClass?: string
    listClass?: string
    showPatterns?: boolean
  }>(),
  {
    title: 'سوالی دارید؟ ما پاسخگو هستیم',
    subtitle: 'برای یافتن پاسخ، می‌توانید از دسته‌بندی‌های زیر استفاده کنید',
    sectionClass: '',
    tabsClass: '',
    listClass: '',
    showPatterns: true,
  },
)

const faqType = ref(props.categories[0]?.id ?? 1)
const expandedIndex = ref<number | null>(null)

const filteredItems = computed(() =>
  props.items.filter((item) => item.type === faqType.value),
)

function selectCategory(id: number) {
  faqType.value = id
  expandedIndex.value = null
}

function toggleItem(index: number) {
  expandedIndex.value = expandedIndex.value === index ? null : index
}
</script>
