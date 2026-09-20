<template>
  <div>
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-8"
    >
      <div class="custom-pad flex flex-col items-center pt-16 md:pt-24">
        <m-faq-divider class="mb-6" />
        <h1 class="text-2xl text-text-tertiary font-yb-bold text-center">
          سوالات متداول
        </h1>
        <p class="mt-4 text-[18px] text-text-tertiary text-center">
          برای یافتن پاسخ، می‌توانید از دسته‌بندی‌های زیر استفاده کنید
        </p>
        <div
          class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 w-full max-w-3xl [&>.btn]:h-10 [&>.btn]:text-sm [&>.btn]:rounded-lg"
        >
          <button
            v-for="category in categories"
            :key="category.id"
            class="btn"
            :class="
              questionType === category.id
                ? 'btn-primary'
                : 'btn-outline border-primary-200 text-primary-500 bg-white'
            "
            @click="selectCategory(category.id)"
          >
            {{ category.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ Accordion -->
    <section class="custom-pad pb-12">
      <div class="space-y-2 max-w-4xl mx-auto">
        <div
          v-for="(item, index) in filteredQuestions"
          :key="item.question"
          class="bg-white px-3 py-4 rounded-lg cursor-pointer text-sm"
          @click="toggleQuestion(index)"
        >
          <div class="flex justify-between items-center gap-4">
            <div class="flex gap-4 items-center">
              <Icon name="svg:plus" size="16" />
              <p>{{ item.question }}</p>
            </div>
            <icons-chevron
              color="black"
              class="shrink-0 transition-all"
              :class="expandedItem === index ? 'rotate-180' : ''"
            />
          </div>
          <div
            class="leading-6 transition-all text-text-passive"
            :class="
              expandedItem === index ? 'pt-4 h-fit' : 'h-0 overflow-hidden'
            "
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { faqCategories as categories, faqs } from "~/data/faqs";

const questionType = ref(categories[0]?.id ?? 1);
const expandedItem = ref<number | null>(null);

const filteredQuestions = computed(() =>
  faqs.filter((q) => q.type === questionType.value),
);

function selectCategory(id: number) {
  questionType.value = id;
  expandedItem.value = null;
}

function toggleQuestion(index: number) {
  expandedItem.value = expandedItem.value === index ? null : index;
}

useSeoMeta({
  title: "سوالات متداول",
  description:
    "پاسخ به رایج‌ترین سوالات درباره خدمات های‌حساب — استخدام حسابدار، رزومه‌ساز و مشاوره",
});
</script>
