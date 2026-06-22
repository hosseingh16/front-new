<template>
  <section class="custom-pad mt-12">
    <p class="text-2xl text-text-tertiary font-yb-bold text-center">
      {{ title }}
    </p>
    <p class="mt-4 text-[18px] text-text-tertiary font-semibold text-center">
      {{ subtitle }}
    </p>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 [&>.btn]:h-8 [&>.btn]:text-sm">
      <button
        v-for="n in 4"
        class="btn"
        :class="
          questionType === n
            ? 'btn-primary'
            : 'btn-outline border-primary-200 text-primary-500'
        "
        @click="questionType = n"
      >
        <span v-if="n === 1">عمومی</span>
        <span v-else-if="n === 2">استخدام حسابدار</span>
        <span v-else-if="n === 3">رزومه ساز</span>
        <span v-else>مشاور</span>
      </button>
    </div>

    <div class="space-y-2 mt-5">
      <div
        v-for="(item, index) in questions.filter((x) => x.type === questionType)"
        class="bg-surface-200 px-3 py-4 rounded-lg cursor-pointer text-sm"
        @click="toggleQuestion(index)"
      >
        <div class="flex justify-between items-center">
          <div class="flex gap-4 items-center">
            <Icon name="svg:plus" size="16" />
            <p>{{ item.title }}</p>
          </div>
          <icons-chevron
            color="black"
            class="transition-all"
            :class="expandedItem === index ? 'rotate-180' : ''"
          />
        </div>
        <div
          class="leading-6 transition-all"
          :class="expandedItem === index ? 'pt-4 h-fit' : 'h-0 overflow-hidden'"
        >
          {{ item.answer }}
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Props
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
  }>(),
  {
    title: 'پاسخ به رایج‌ترین سوالات درباره خدمات های‌حساب',
    subtitle:
      'نظرات کارفرمایان و حسابدارانی که بابرای یافتن پاسخ، می‌توانید از دسته‌بندی‌های زیر استفاده کنید',
  },
);

// Variables
const questionType = ref(1);
const questions = [
  {
    type: 1,
    title: 'های‌حساب چیست ؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'چگونه می‌توانم به آگهی های شغلی مناسب دسترسی پیدا کنم ؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'آیا می‌توانم رزومه خود را برای چندین آگهی مختلف ارسال کنم ؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'چگونه می توانم وضعیت رزومه های ارسال شده را پیگیری کنم ؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'آیا ارسال رزومه به چندین کارفرما تأثیر مثبتی دارد؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'چگونه می‌توانم رزومه‌ام را برای هر آگهی سفارشی کنم؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
];
const expandedItem = ref<number | null>(null);

// Functions
function toggleQuestion(index: number) {
  if (expandedItem.value === index) expandedItem.value = null;
  else expandedItem.value = index;
}
</script>
