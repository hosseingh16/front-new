<template>
  <div>
    Breadcrumb
    <section class="custom-pad pt-6">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="hover:text-primary-500 transition-colors">خانه</NuxtLink>
        <span class="mx-2">/</span>
        <span>خدمات</span>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">اظهارنامه عملکرد</span>
      </nav>
    </section>

    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-10 md:pb-16"
    >
      <div class="custom-pad flex flex-col items-center pt-8 md:pt-12">
        <span
          class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
        >
          خدمات مالیاتی
        </span>
        <h1
          class="mt-6 max-w-4xl text-center font-yb-bold text-2xl leading-10 text-text-tertiary md:text-h1"
        >
          اظهارنامه عملکرد خود را به حسابداران تاییدشده بسپارید
        </h1>
        <p
          class="mt-4 max-w-2xl text-center text-base font-semibold leading-8 text-text-tertiary md:text-lg"
        >
          درخواست خود را ثبت کنید تا حسابدار متخصص، انجام اظهارنامه مالیاتی شما را
          پیگیری کند.
        </p>
        <button class="btn btn-primary mt-8 gap-2 px-6">
          <Icon name="svg:new-notepad-text" size="22" />
          ثبت درخواست اظهارنامه
        </button>

        <img
          :src="heroMobile"
          alt="تقویم مهلت ارسال اظهارنامه عملکرد"
          class="mt-10 w-full max-w-md md:hidden"
        />
        <img
          :src="heroDesktop"
          alt="تقویم مهلت ارسال اظهارنامه عملکرد"
          class="mt-12 hidden w-full max-w-5xl md:block"
        />
      </div>
    </section>

    <!-- Target Audience -->
    <section class="custom-pad py-10 md:py-14">
      <h2 class="text-center font-yb-bold text-xl text-text-tertiary md:text-2xl">
        چه کسانی می‌توانند ثبت درخواست کنند؟
      </h2>
      <div
        class="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:flex-wrap sm:justify-center md:gap-8"
      >
        <div
          v-for="item in audienceItems"
          :key="item.label"
          class="flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:min-w-[220px]"
        >
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50"
          >
            <Icon :name="item.icon" size="22" class="text-primary-500" />
          </div>
          <p class="font-semibold text-sm text-text-tertiary md:text-base">
            {{ item.label }}
          </p>
        </div>
      </div>
    </section>

    <!-- Pain Points -->
    <section class="custom-pad pb-12 md:pb-16">
      <div
        class="overflow-hidden rounded-3xl bg-[#161929] px-6 py-10 md:px-12 md:py-14"
      >
        <div class="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div class="order-2 lg:order-1">
            <h2 class="font-yb-bold text-xl leading-10 text-white md:text-2xl">
              های‌حساب این مسیر را ساده کرده است
            </h2>
            <p class="mt-4 text-sm leading-8 text-white/70 md:text-base">
              برای اطلاعات بیشتر با کارشناسان ما تماس بگیرید و از مشاوره رایگان بهره‌مند
              شوید.
            </p>
            <NuxtLink to="/contact">
              <button
                class="btn mt-8 border-2 border-white bg-transparent text-white hover:bg-white/10"
              >
                مشاوره رایگان
              </button>
            </NuxtLink>
          </div>

          <div class="order-1 lg:order-2">
            <h3 class="font-yb-bold text-lg text-white md:text-xl">
              این مشکلات برای شما آشناست؟
            </h3>
            <ul class="mt-6 space-y-4">
              <li
                v-for="item in painPoints"
                :key="item"
                class="flex items-start gap-3 text-sm leading-7 text-white/90 md:text-base"
              >
                <span
                  class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF803033]"
                >
                  <Icon name="svg:warning" size="16" class="text-[#FF8030]" />
                </span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="custom-pad py-10 md:py-16">
      <div class="flex flex-col items-center">
        <span
          class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
        >
          فرآیند کار
        </span>
        <h2 class="mt-4 font-yb-bold text-xl text-text-tertiary md:text-2xl">
          چطور انجام می‌شود؟
        </h2>
      </div>

      <div class="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div class="hidden justify-center lg:flex">
          <div class="relative flex flex-col items-center gap-8 py-8">
            <div
              class="absolute inset-y-8 right-1/2 w-px translate-x-1/2 border-r-2 border-dashed border-gray-300"
            />
            <div
              v-for="(step, index) in processSteps"
              :key="step.title"
              class="relative z-10 flex w-64 items-center gap-4 rounded-2xl bg-surface-100 p-4"
            >
              <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm"
              >
                <Icon :name="step.icon" size="24" class="text-primary-500" />
              </div>
              <div>
                <p class="text-xs text-text-passive">{{ index + 1 }}.</p>
                <p class="font-semibold text-sm text-text-tertiary">{{ step.title }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(step, index) in processSteps"
            :key="step.title"
            class="cursor-pointer rounded-xl border border-gray-default bg-white px-4 py-4"
            @click="toggleProcessStep(index)"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-sm font-yb-bold text-primary-500"
                >
                  {{ index + 1 }}
                </span>
                <p class="font-semibold text-sm text-text-tertiary md:text-base">
                  {{ step.title }}
                </p>
              </div>
              <icons-chevron
                color="black"
                class="shrink-0 transition-transform"
                :class="expandedProcessStep === index ? 'rotate-180' : ''"
              />
            </div>
            <div
              class="overflow-hidden text-sm leading-7 text-text-passive transition-all"
              :class="expandedProcessStep === index ? 'mt-4 h-fit' : 'h-0'"
            >
              {{ step.description }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section
      class="bg-linear-to-b from-[#E5F9F2] to-white py-12 md:py-16"
    >
      <div class="custom-pad">
        <h2 class="text-center font-yb-bold text-xl text-text-tertiary md:text-2xl">
          چرا به های‌حساب اعتماد کنیم؟
        </h2>
        <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          <div
            v-for="item in benefits"
            :key="item.title"
            class="relative rounded-2xl border-2 border-accent-500 bg-white px-6 pb-6 pt-12 text-center"
          >
            <div
              class="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-accent-500 text-white"
            >
              <Icon :name="item.icon" size="22" />
            </div>
            <h3 class="font-yb-bold text-base text-text-tertiary md:text-lg">
              {{ item.title }}
            </h3>
            <p class="mt-3 text-sm leading-7 text-text-passive">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Secondary CTA -->
    <section class="custom-pad pb-12 md:pb-16">
      <div
        class="flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#161929] px-6 py-8 md:flex-row md:px-10 md:py-10"
      >
        <p class="text-center font-yb-bold text-lg text-white md:text-right md:text-xl">
          همین حالا درخواست اظهارنامه خود را ثبت کنید
        </p>
        <button class="btn btn-primary shrink-0 gap-2 px-6">
          <Icon name="svg:new-notepad-text" size="22" />
          ثبت درخواست اظهارنامه
        </button>
      </div>
    </section>

    <!-- FAQ -->
    <section class="custom-pad pb-12">
      <div class="flex flex-col items-center">
        <m-faq-divider class="mb-6" />
        <h2 class="text-center font-yb-bold text-xl text-text-tertiary md:text-2xl">
          سوالی دارید؟ ما پاسخگو هستیم
        </h2>
        <p class="mt-3 text-center text-sm text-text-passive md:text-base">
          برای یافتن پاسخ، می‌توانید از دسته‌بندی‌های زیر استفاده کنید
        </p>
      </div>

      <div
        class="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-2 [&>.btn]:h-10 [&>.btn]:rounded-[8px] [&>.btn]:text-sm"
      >
        <button
          v-for="category in faqCategories"
          :key="category.id"
          class="btn"
          :class="
            faqType === category.id
              ? 'btn-primary'
              : 'btn-outline border-primary-200 bg-white text-primary-500'
          "
          @click="selectFaqCategory(category.id)"
        >
          {{ category.label }}
        </button>
      </div>

      <div class="mx-auto mt-6 max-w-3xl space-y-2">
        <div
          v-for="(item, index) in filteredFaqs"
          :key="item.question"
          class="cursor-pointer rounded-lg bg-surface-200 px-4 py-4 text-sm"
          @click="toggleFaq(index)"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <Icon name="svg:plus" size="16" />
              <p class="font-semibold text-text-tertiary">{{ item.question }}</p>
            </div>
            <icons-chevron
              color="black"
              class="shrink-0 transition-transform"
              :class="expandedFaq === index ? 'rotate-180' : ''"
            />
          </div>
          <div
            class="leading-7 text-text-passive transition-all"
            :class="expandedFaq === index ? 'mt-4 h-fit' : 'h-0 overflow-hidden'"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="custom-pad pb-16 bg-surface-100">
      <div class="rounded-lg bg-primary-500 p-6 text-white">
        <p class="text-2xl font-yb-bold max-sm:text-center">
          اولین پلتفرم تخصصی استخدام حسابدار در ایران
        </p>
        <p class="mt-5 leading-8 text-surface-50">
          انتخاب حسابدار، به‌دلیل نقش تأثیرگذار او در ساختار مالی شرکت، فرایندی حساس و
          نیازمند دقت است.<br />های‌حساب با ارائه رزومه‌های تخصصی و جامعه‌ای از حسابداران
          حرفه‌ای، این مسیر را برای کارفرمایان مطمئن‌تر می‌کند.هم‌زمان، حسابداران نیز
          می‌توانند با رزومه استاندارد و فرصت‌های شغلی متنوع، مسیر رشد شغلی و افزایش
          درآمد خود را هموارتر سازند.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import heroDesktop from '~/assets/vectors/pages/tax-return/hero-image.svg'
import heroMobile from '~/assets/vectors/pages/tax-return/hero-image-mobile.svg'

const audienceItems = [
  { label: 'کسب‌وکارهای تولیدی', icon: 'svg:buildings-3' },
  { label: 'کسب‌وکارهای بازرگانی', icon: 'svg:bag-1' },
  { label: 'کسب‌وکارهای خدماتی', icon: 'svg:people' },
]

const painPoints = [
  'نگرانی از جریمه و پلمپ دفاتر به‌دلیل تأخیر در ارسال اظهارنامه',
  'نداشتن زمان کافی برای پیگیری فرآیندهای مالیاتی',
  'عدم دسترسی به حسابدار متخصص و آشنا به قوانین روز',
  'پیچیدگی فرم‌ها و مدارک مورد نیاز سامانه مالیاتی',
  'هزینه بالای خدمات مشاوره و تنظیم اظهارنامه',
]

const processSteps = [
  {
    title: 'فرم را تکمیل کنید',
    description:
      'اطلاعات کسب‌وکار و جزئیات مورد نیاز برای اظهارنامه عملکرد را در فرم آنلاین وارد کنید.',
    icon: 'svg:new-notepad-text',
  },
  {
    title: 'درخواست شما بررسی می‌شود',
    description:
      'تیم های‌حساب درخواست شما را بررسی کرده و مناسب‌ترین حسابدار متخصص را معرفی می‌کند.',
    icon: 'svg:search-normal',
  },
  {
    title: 'حسابدار با شما تماس می‌گیرد',
    description:
      'حسابدار تاییدشده با شما هماهنگ کرده و فرآیند تنظیم و ارسال اظهارنامه را آغاز می‌کند.',
    icon: 'svg:call',
  },
]

const benefits = [
  {
    title: 'حسابداران تایید شده',
    description:
      'همکاری با حسابدارانی که صلاحیت و سوابق حرفه‌ای آن‌ها توسط های‌حساب بررسی شده است.',
    icon: 'svg:user-tick',
  },
  {
    title: 'همکاری با متخصصان مالیاتی',
    description:
      'دسترسی به متخصصانی که با قوانین مالیاتی و فرآیندهای سامانه مودیان آشنایی دارند.',
    icon: 'svg:tax',
  },
  {
    title: 'حفظ محرمانگی اطلاعات',
    description:
      'اطلاعات مالی و تجاری شما با رعایت کامل اصول محرمانگی نگهداری و پردازش می‌شود.',
    icon: 'svg:lock',
  },
  {
    title: 'پشتیبانی در فرآیند انجام کار',
    description:
      'تیم پشتیبانی های‌حساب در تمام مراحل ثبت درخواست تا تحویل اظهارنامه همراه شماست.',
    icon: 'svg:heart-tick',
  },
]

const faqCategories = [
  { id: 1, label: 'ثبت اظهارنامه' },
  { id: 2, label: 'عمومی' },
]

const faqs = [
  {
    type: 1,
    question: 'چه مدارکی برای ثبت درخواست اظهارنامه لازم است؟',
    answer:
      'اطلاعات هویتی کسب‌وکار، کد اقتصادی، سوابق مالی سال قبل و دسترسی به سامانه مالیاتی از جمله موارد مورد نیاز است. پس از ثبت درخواست، حسابدار لیست دقیق مدارک را اعلام می‌کند.',
  },
  {
    type: 1,
    question: 'چقدر طول می‌کشد تا اظهارنامه من آماده شود؟',
    answer:
      'بسته به حجم فعالیت و تکمیل بودن مدارک، معمولاً بین ۳ تا ۱۰ روز کاری زمان نیاز است. حسابدار پس از بررسی اولیه، زمان‌بندی دقیق را اعلام می‌کند.',
  },
  {
    type: 1,
    question: 'هزینه تنظیم اظهارنامه چگونه محاسبه می‌شود؟',
    answer:
      'هزینه بر اساس نوع کسب‌وکار، حجم عملکرد و پیچیدگی پرونده تعیین می‌شود. پس از بررسی درخواست، پیش‌فاکتور شفاف قبل از شروع کار ارائه می‌گردد.',
  },
  {
    type: 1,
    question: 'آیا می‌توانم وضعیت درخواست خود را پیگیری کنم؟',
    answer:
      'بله. پس از ثبت درخواست، از طریق پنل کاربری یا تماس با پشتیبانی می‌توانید وضعیت پیگیری پرونده را مشاهده کنید.',
  },
  {
    type: 2,
    question: 'های‌حساب چه خدماتی ارائه می‌دهد؟',
    answer:
      'های‌حساب پلتفرم تخصصی استخدام حسابدار، ساخت رزومه، ثبت آگهی استخدام و خدمات مالیاتی از جمله تنظیم اظهارنامه عملکرد است.',
  },
  {
    type: 2,
    question: 'آیا اطلاعات من محرمانه باقی می‌ماند؟',
    answer:
      'بله. تمامی اطلاعات مطابق سیاست حریم خصوصی های‌حساب محافظت شده و فقط در اختیار حسابدار مسئول پرونده قرار می‌گیرد.',
  },
]

const faqType = ref(1)
const expandedFaq = ref<number | null>(null)
const expandedProcessStep = ref(0)

const filteredFaqs = computed(() => faqs.filter((item) => item.type === faqType.value))

function selectFaqCategory(id: number) {
  faqType.value = id
  expandedFaq.value = null
}

function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

function toggleProcessStep(index: number) {
  expandedProcessStep.value = expandedProcessStep.value === index ? -1 : index
}

useSeoMeta({
  title: 'اظهارنامه عملکرد',
  description:
    'ثبت درخواست اظهارنامه عملکرد با حسابداران تاییدشده های‌حساب — مشاوره رایگان و پیگیری تخصصی',
})
</script>
