<template>
  <div>
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-8"
    >
      <div class="custom-pad flex flex-col items-center pt-16 md:pt-24">
        <m-faq-divider class="mb-6" />
        <h1 class="text-2xl text-text-tertiary font-yb-bold text-center">
          سوالی دارید؟ ما پاسخگو هستیم
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
          :key="item.title"
          class="bg-white px-3 py-4 rounded-lg cursor-pointer text-sm"
          @click="toggleQuestion(index)"
        >
          <div class="flex justify-between items-center gap-4">
            <div class="flex gap-4 items-center">
              <Icon name="svg:plus" size="16" />
              <p>{{ item.title }}</p>
            </div>
            <icons-chevron
              color="black"
              class="shrink-0 transition-all"
              :class="expandedItem === index ? 'rotate-180' : ''"
            />
          </div>
          <div
            class="leading-6 transition-all text-text-passive"
            :class="expandedItem === index ? 'pt-4 h-fit' : 'h-0 overflow-hidden'"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="custom-pad pb-16 bg-surface-100">
      <div class="bg-primary-500 p-6 rounded-lg text-white">
        <p class="text-2xl font-yb-bold max-sm:text-center">
          اولین پلتفرم تخصصی استخدام حسابدار در ایران
        </p>
        <p class="mt-5 text-surface-50 leading-8">
          انتخاب حسابدار، به‌دلیل نقش تأثیرگذار او در ساختار مالی شرکت، فرایندی حساس و
          نیازمند دقت است.<br />های‌حساب با ارائه رزومه‌های تخصصی و جامعه‌ای از حسابداران
          حرفه‌ای، این مسیر را برای کارفرمایان مطمئن‌تر می‌کند.هم‌زمان، حسابداران نیز
          می‌توانند با رزومه استاندارد و فرصت‌های شغلی متنوع، مسیر رشد شغلی و افزایش درآمد
          خود را هموارتر سازند.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const categories = [
  { id: 1, label: 'عمومی' },
  { id: 2, label: 'استخدام حسابدار' },
  { id: 3, label: 'رزومه ساز' },
  { id: 4, label: 'مشاور مالی' },
]

const questionType = ref(1)
const expandedItem = ref<number | null>(null)

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
    title: 'آیا ارسال رزومه به چندین کارفرما تاثیر منفی دارد؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'چگونه می‌توانم رزومه‌ام را برای هر آگهی سفارشی کنم؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 2,
    title: 'چگونه می‌توانم حسابدار مناسب استخدام کنم؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 2,
    title: 'هزینه ثبت آگهی استخدام چقدر است؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 3,
    title: 'رزومه‌ساز های‌حساب چه امکاناتی دارد؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 3,
    title: 'آیا می‌توانم رزومه خود را دانلود کنم؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 4,
    title: 'مشاور مالی های‌حساب چه خدماتی ارائه می‌دهد؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 4,
    title: 'چگونه می‌توانم از مشاور مالی استفاده کنم؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
]

const filteredQuestions = computed(() =>
  questions.filter((q) => q.type === questionType.value),
)

function selectCategory(id: number) {
  questionType.value = id
  expandedItem.value = null
}

function toggleQuestion(index: number) {
  expandedItem.value = expandedItem.value === index ? null : index
}

useSeoMeta({
  title: 'سوالات متداول',
  description:
    'پاسخ به رایج‌ترین سوالات درباره خدمات های‌حساب — استخدام حسابدار، رزومه‌ساز و مشاور مالی',
})
</script>
