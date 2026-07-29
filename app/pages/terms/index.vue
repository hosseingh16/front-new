<template>
  <div>
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-8"
    >
      <div class="custom-pad flex flex-col items-center pt-16 md:pt-24">
        <span
          class="mb-6 inline-flex items-center rounded-full bg-primary-100 px-4 py-1.5 text-sm font-semibold text-primary-500"
        >
          خدمات های‌حساب
        </span>
        <h1 class="text-2xl text-text-tertiary font-yb-bold text-center">
          قوانین و مقررات استفاده از های حساب
        </h1>
        <p class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary">
          استفاده از خدمات «های حساب» به منزله پذیرش کامل قوانین و مقررات این پلتفرم
          است. لطفاً پیش از استفاده از خدمات، این موارد را با دقت مطالعه کنید.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="custom-pad pb-12">
      <div
        class="rounded-2xl py-6 md:py-10"
      >
        <div class="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8">
          <!-- Table of Contents -->
          <aside
            class="h-fit self-start rounded-xl bg-white p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto"
          >
            <div class="mb-4 flex items-center gap-2 text-text-tertiary">
              <Icon name="lucide:list" size="18" class="shrink-0" />
              <p class="font-yb-bold text-sm">فهرست مطالب</p>
            </div>
            <ul class="space-y-3">
              <li v-for="section in sections" :key="section.id">
                <button
                  type="button"
                  class="w-full cursor-pointer text-right text-sm leading-6 transition-colors"
                  :class="
                    activeSection === section.id
                      ? 'font-semibold text-primary-500'
                      : 'text-text-passive hover:text-primary-500'
                  "
                  @click="scrollToSection(section.id)"
                >
                  {{ section.title }}
                </button>
              </li>
            </ul>
          </aside>

          <!-- Terms Content -->
          <div class="min-w-0 space-y-12 rounded-xl bg-white p-6 md:p-10">
            <section
              v-for="section in sections"
              :id="section.id"
              :key="section.id"
              class="scroll-mt-28"
            >
              <h2 class="font-yb-bold text-lg text-text-tertiary md:text-xl">
                {{ section.title }}
              </h2>
              <div class="mt-4 space-y-4 text-sm leading-8 text-text-passive">
                <p v-for="(paragraph, index) in section.paragraphs" :key="index">
                  {{ paragraph }}
                </p>
                <ul v-if="section.items?.length" class="list-disc space-y-2 pr-5">
                  <li v-for="(item, index) in section.items" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
type TermsSection = {
  id: string
  title: string
  paragraphs: string[]
  items?: string[]
}

const sections: TermsSection[] = [
  {
    id: 'introduction',
    title: 'مقدمه',
    paragraphs: [
      'استفاده از خدمات «های حساب» به منزله پذیرش کامل قوانین و مقررات این پلتفرم است. تمامی کاربران موظف هستند پیش از استفاده از خدمات سایت، این قوانین را مطالعه کنند.',
    ],
  },
  {
    id: 'platform-services',
    title: '۱. تعریف خدمات های حساب',
    paragraphs: [
      'های حساب یک پلتفرم تخصصی در حوزه استخدام و خدمات حسابداری است که امکانات زیر را در اختیار کاربران قرار می‌دهد:',
    ],
    items: [
      'ساخت و مدیریت رزومه حسابداری',
      'مشاهده و ارسال رزومه برای فرصت‌های شغلی',
      'ثبت آگهی استخدام حسابدار',
      'ثبت پروژه حسابداری',
      'ثبت درخواست اظهارنامه مالیاتی',
      'ارتباط میان کارفرمایان، حسابداران و مشاوران مالیاتی تاییدشده',
    ],
  },
  {
    id: 'registration-account',
    title: '۲. شرایط ثبت نام و حساب کاربری',
    paragraphs: [],
    items: [
      'استفاده از خدمات سایت نیازمند ثبت نام و تایید شماره موبایل است.',
      'هر کاربر مسئول حفظ امنیت حساب کاربری و اطلاعات ورود خود می‌باشد.',
      'کاربران موظف هستند اطلاعات صحیح و واقعی وارد کنند.',
      'های حساب می‌تواند در صورت مشاهده اطلاعات نادرست یا فعالیت مشکوک، حساب کاربری را محدود یا مسدود کند.',
    ],
  },
  {
    id: 'resume-jobs',
    title: '۳. قوانین مربوط به رزومه و فرصت‌های شغلی',
    paragraphs: [],
    items: [
      'مسئولیت صحت اطلاعات درج‌شده در رزومه برعهده کاربر است.',
      'ارسال رزومه به آگهی‌های استخدام به معنای پذیرش شرایط اعلام‌شده توسط کارفرما می‌باشد.',
      'های حساب مسئول استخدام نهایی، توافقات مالی یا اختلافات میان کارجو و کارفرما نیست.',
      'کاربران نباید اطلاعات خلاف واقع، توهین‌آمیز یا غیرقانونی در رزومه یا آگهی‌ها ثبت کنند.',
    ],
  },
  {
    id: 'job-ads',
    title: '۴. قوانین ثبت آگهی استخدام',
    paragraphs: [],
    items: [
      'ثبت آگهی استخدام تنها پس از پرداخت هزینه و تایید توسط تیم پشتیبانی انجام می‌شود.',
      'آگهی‌ها قبل از انتشار بررسی می‌شوند و در صورت مغایرت با قوانین سایت ممکن است رد شوند.',
      'هر آگهی استخدام به مدت ۳۰ روز در سایت فعال خواهد بود.',
      'مسئولیت محتوای آگهی و اطلاعات درج‌شده برعهده کارفرما است.',
      'های حساب می‌تواند آگهی‌های نامرتبط، غیرواقعی یا مغایر با قوانین را حذف کند.',
    ],
  },
  {
    id: 'tax-return-service',
    title: '۵. قوانین خدمات اظهارنامه مالیاتی',
    paragraphs: [],
    items: [
      'خدمات اظهارنامه توسط مشاوران مالیاتی و حسابداران تاییدشده انجام می‌شود.',
      'ثبت درخواست اظهارنامه به معنای پذیرش فرایند بررسی و ارجاع توسط های حساب است.',
      'مسئولیت صحت مدارک و اطلاعات مالی وارد‌شده برعهده کاربر می‌باشد.',
      'های حساب تلاش می‌کند خدمات توسط متخصصان معتبر انجام شود، اما مسئول تصمیمات مالی یا حقوقی ناشی از اطلاعات اشتباه کاربران نخواهد بود.',
    ],
  },
  {
    id: 'payments-refund',
    title: '۶. پرداخت‌ها و بازگشت وجه',
    paragraphs: [],
    items: [
      'هزینه خدمات قبل از فعال‌سازی دریافت می‌شود.',
      'در صورت ثبت موفق آگهی یا شروع فرایند خدمات، امکان بازگشت وجه وجود نخواهد داشت مگر در شرایطی که توسط پشتیبانی تایید شود.',
      'کاربران موظف هستند پیش از پرداخت، اطلاعات خدمات را به دقت بررسی کنند.',
    ],
  },
  {
    id: 'privacy',
    title: '۷. حریم خصوصی و محرمانگی اطلاعات',
    paragraphs: [],
    items: [
      'اطلاعات کاربران به صورت محرمانه نگهداری می‌شود.',
      'های حساب متعهد است بدون اجازه کاربر، اطلاعات شخصی را در اختیار اشخاص ثالث قرار ندهد؛ مگر در موارد قانونی.',
      'کاربران مسئول حفظ محرمانگی اطلاعات حساب کاربری خود هستند.',
    ],
  },
  {
    id: 'account-deletion',
    title: '۸. حذف یا غیرفعالسازی حساب کاربری',
    paragraphs: [],
    items: [
      'کاربران می‌توانند حساب کاربری خود را موقت غیرفعال کنند.',
      'امکان درخواست حذف کامل حساب کاربری نیز وجود دارد.',
      'های حساب می‌تواند در صورت نقض قوانین، حساب کاربری کاربران را محدود یا مسدود کند.',
    ],
  },
  {
    id: 'liability',
    title: '۹. محدودیت مسئولیت',
    paragraphs: [],
    items: [
      'های حساب صرفاً بستر ارتباط میان کاربران را فراهم می‌کند.',
      'مسئولیت توافقات استخدامی، قراردادها، پرداخت حقوق، همکاری‌های پروژه‌ای یا اختلافات احتمالی میان کاربران برعهده طرفین است.',
      'های حساب مسئول قطعی اینترنت، مشکلات بانکی یا اختلالات خارج از کنترل پلتفرم نخواهد بود.',
    ],
  },
  {
    id: 'changes',
    title: '۱۰. تغییر قوانین',
    paragraphs: [
      'های حساب می‌تواند در هر زمان قوانین و مقررات را بروزرسانی کند. ادامه استفاده از سایت به معنای پذیرش نسخه جدید قوانین خواهد بود.',
    ],
  },
]

const activeSection = ref(sections[0]?.id ?? '')

function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  activeSection.value = id
  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

onMounted(() => {
  const hash = window.location.hash.replace('#', '')
  if (hash && sections.some((section) => section.id === hash)) {
    nextTick(() => scrollToSection(hash))
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visible[0]?.target.id) {
        activeSection.value = visible[0].target.id
      }
    },
    {
      rootMargin: '-120px 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 1],
    },
  )

  sections.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element) observer.observe(element)
  })

  onUnmounted(() => observer.disconnect())
})

useSeoMeta({
  title: 'قوانین و مقررات استفاده از های حساب',
  description:
    'قوانین و مقررات استفاده از خدمات پلتفرم های حساب — استخدام حسابدار، رزومه‌ساز، پروژه‌های حسابداری و اظهارنامه مالیاتی',
})
</script>
