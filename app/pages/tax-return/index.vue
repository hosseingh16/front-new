<template>
  <div>
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-5.png')] bg-no-repeat bg-top pb-10 md:pb-16"
    >
    <div class="custom-pad pt-6">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
          <Icon name="svg:home" size="16" />
        </NuxtLink>
        <span class="mx-2">/</span>
        <span>خدمات</span>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">اظهارنامه عملکرد</span>
      </nav>
    </div>

      <div class="custom-pad flex flex-col items-center pt-8 md:pt-12">
        <span
          class="inline-flex items-center rounded-xl bg-accent-300 px-4 py-2 text-sm font-semibold text-accent-500"
        >
          خدمات های‌حساب
        </span>
        <h1
          class="mt-6 max-w-4xl text-center font-yb-bold text-2xl leading-10 text-text-tertiary md:text-h1"
        >
          اظهارنامه عملکرد خود را به حسابداران تاییدشده بسپارید
        </h1>
        <p
          class="mt-4 max-w-3xl text-center text-base font-semibold leading-8 text-text-tertiary md:text-lg"
        >
          درخواست خود را ثبت کنید تا حسابدار متخصص، انجام اظهارنامه مالیاتی شما را
          پیگیری کند.
        </p>
        <button class="btn btn-primary mt-8 gap-2 px-6">
          <Icon name="lucide:pen-line" size="18" class="text-white" />
          <span>ثبت درخواست اظهارنامه</span>
   
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
    <section class="custom-pad py-3 md:py-3">
      <div class="flex justify-center">
        <h2 class="flex items-center justify-center gap-3 text-center font-yb-bold text-xl md:text-xl bg-white text-text-tertiary py-2 px-6 rounded-full shadow-lg w-fit mx-auto">
          چه کسانی می‌توانند ثبت درخواست کنند؟
        </h2>

      </div>
      <div
        class="mt-2 flex flex-col items-stretch sm:flex-row sm:flex-wrap sm:justify-center"
      >
        <div
          v-for="item in audienceItems"
          :key="item.label"
          class="flex items-center justify-center gap-3 px-2 rounded-xl py-4 text-shadow-lg"
        >
          <p class="font-semibold text-sm text-text-tertiary md:text-base">
            {{ item.label }}
          </p>
          <img
            v-if="item !== audienceItems[audienceItems.length - 1]"
            :src="seprator"
            alt="separator"
            class="w-4 h-4"
          />
  
        </div>
      </div>
    </section>

    <!-- Pain Points -->
    <section class="custom-pad pb-12 md:pb-16 text-center flex flex-col items-center">
      <img
        :src="bannerMobile"
        alt=""
        class="mt-10 w-full md:hidden mx-auto"
      />
      <img
        :src="banner"
        alt=""
        class="mt-12 hidden w-full md:block mx-auto"
      />
    </section>

    <!-- How It Works -->
    <section class="relative py-10 md:py-16">
      <BackgroundPattern position="left" side="-3.75rem" top="25%" />
      <BackgroundPattern position="right" side="-3.75rem" top="66.666667%" />

      <div class="custom-pad relative z-10 flex flex-col items-center">
        <span
          class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
        >
          فرآیند کار
        </span>
        <h2 class="mt-4 font-yb-bold text-xl text-text-tertiary md:text-2xl">
          چطور انجام می‌شود؟
        </h2>
      </div>

      <div class="custom-pad relative z-10 mt-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div class="space-y-2">
          <div
            v-for="(step, index) in processSteps"
            :key="step.title"
            class="cursor-pointer rounded-lg border-gray-default bg-white px-4 py-4"
            @click="toggleProcessStep(index)"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <Icon name="svg:plus" size="16" />
                <p class="font-semibold text-sm text-text-tertiary md:text-base">
                  {{ index + 1 }} : {{ step.title }}
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

        <div class="flex justify-center align-middle">
          <div class="relative">
            <Transition name="process-step">
              <img
                :key="activeProcessIllustration"
                :src="activeProcessIllustration"
                alt=""
                class="object-contain flex justify-center"
              />
            </Transition>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="custom-pad py-12 md:py-16">
      <div
        class="relative rounded-lg bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFFF_0%,#AADFCC_100%)] p-6 pt-14"
      >
        <h2
          class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white shadow-lg px-6 py-2.5 text-center font-yb-bold text-sm text-text-tertiary md:px-8 md:text-base"
        >
          چرا به های‌حساب اعتماد کنم؟
        </h2>

        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="item in benefits"
            :key="item.title"
            class="relative rounded-2xl bg-white px-4 pb-6 pt-14 text-center mt-14"
          >
            <div
              class="absolute -top-12 left-1/2 -translate-x-1/2 rounded-full p-1"
            >
              <div
                class="rounded-full border-2 border-dashed border-primary-500 p-2.5"
              >
                <div
                  class="flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_25%,#a1efd4_0%,#fff5cc_100%)] [&_svg_path]:fill-primary-900"
                >
                  <Icon name="svg:user-tick" size="24" />
                </div>
              </div>
            </div>
            <h3 class="font-yb-bold text-sm text-primary-500 md:text-base">
              {{ item.title }}
            </h3>
            <p class="mt-3 text-sm leading-7 text-text-tertiary">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Secondary CTA -->
    <section class="custom-pad pb-12 md:pb-16">
      <m-calc-divider class="mb-6" />
      <div
        class="flex flex-col items-center justify-between gap-6 rounded-2xl bg-[#161929] px-6 py-8 md:flex-row md:px-10 md:py-10"
      >
        <p class="text-center font-yb-bold text-lg text-white md:text-right md:text-xl">
          همین حالا درخواست اظهارنامه خود را ثبت کنید
        </p>
        <button class="btn btn-primary shrink-0 gap-2 px-6">

          <Icon name="lucide:pen-line" size="18" class="text-white" />
          ثبت درخواست اظهارنامه
        </button>
      </div>
    </section>

    <!-- FAQ -->
    <section class="custom-pad pb-12 relative">
      <BackgroundPattern position="left" side="-3.75rem" top="25%" />
      <BackgroundPattern position="right" side="-3.75rem" top="66.666667%" />

      <div class="flex flex-col items-center">
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
              <p class="font-light text-text-tertiary">{{ item.question }}</p>
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
import seprator from '~/assets/vectors/pages/tax-return/seprator.svg'
import step0 from '~/assets/vectors/pages/tax-return/step0.webp'
import step1 from '~/assets/vectors/pages/tax-return/step1.webp'
import step2 from '~/assets/vectors/pages/tax-return/step2.webp'
import step3 from '~/assets/vectors/pages/tax-return/step3.webp'
import bannerMobile from '~/assets/vectors/pages/tax-return/banner-mobile.webp'
import banner from '~/assets/vectors/pages/tax-return/banner.webp'

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
  },
  {
    title: 'درخواست شما بررسی می‌شود',
    description:
      'تیم های‌حساب درخواست شما را بررسی کرده و مناسب‌ترین حسابدار متخصص را معرفی می‌کند.',
  },
  {
    title: 'حسابدار با شما تماس می‌گیرد',
    description:
      'حسابدار تاییدشده با شما هماهنگ کرده و فرآیند تنظیم و ارسال اظهارنامه را آغاز می‌کند.',
  },
]

const processIllustrations = [step0, step1, step2, step3]

const benefits = [
  {
    title: 'حسابداران تایید شده',
    description:
      'پروژه‌های اظهارنامه در های‌حساب تنها توسط حسابداران و مشاوران مالیاتی بررسی‌شده انجام می‌شوند تا با اطمینان بیشتری همکاری کنید.',
  },
  {
    title: 'همکاری با متخصصان مالیاتی',
    description:
      'درخواست شما به افرادی ارجاع داده می‌شود که تجربه انجام پروژه‌های مالیاتی و اظهارنامه را به‌صورت تخصصی دارند.',
  },
  {
    title: 'حفظ محرمانگی اطلاعات',
    description:
      'اطلاعات مالی و اسناد شما با رعایت اصول محرمانگی بررسی شده و تنها در اختیار متخصص مربوط به پروژه قرار می‌گیرد.',
  },
  {
    title: 'پشتیبانی در فرآیند انجام کار',
    description:
      'از زمان ثبت درخواست تا انجام نهایی اظهارنامه، تیم‌های های‌حساب در کنار شماست تا فرآیند همکاری سریع‌تر و شفاف‌تر پیش برود.',
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
const expandedProcessStep = ref(-1)

const activeProcessIllustration = computed(() => {
  if (expandedProcessStep.value < 0) return step0
  return processIllustrations[expandedProcessStep.value + 1] ?? step0
})

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
