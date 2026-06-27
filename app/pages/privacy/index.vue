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
        <h1 class="text-2xl text-text-tertiary font-yb-bold text-center">حریم خصوصی</h1>
        <p class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary">
          حفظ حریم خصوصی کاربران برای های‌حساب اولویت دارد. در این صفحه توضیح می‌دهیم
          چه اطلاعاتی جمع‌آوری می‌کنیم، چگونه از آن‌ها استفاده می‌کنیم و چه حقوقی
          دارید.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="custom-pad pb-12">
      <div class="rounded-2xl py-6 md:py-10">
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

          <!-- Privacy Content -->
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
type PrivacySection = {
  id: string
  title: string
  paragraphs: string[]
  items?: string[]
}

const sections: PrivacySection[] = [
  {
    id: 'policy-overview',
    title: 'این سیاست چیست؟',
    paragraphs: [
      'سیاست حریم خصوصی های‌حساب نحوه جمع‌آوری، استفاده، نگهداری و محافظت از اطلاعات شخصی کاربران را توضیح می‌دهد.',
      'با ثبت‌نام یا استفاده از خدمات های‌حساب، شما با مفاد این سیاست موافقت می‌کنید. در صورت عدم موافقت، لطفاً از خدمات استفاده نکنید.',
    ],
  },
  {
    id: 'data-collection',
    title: 'اطلاعاتی که جمع‌آوری می‌کنیم',
    paragraphs: ['ممکن است اطلاعات زیر را از کاربران دریافت و ذخیره کنیم:'],
    items: [
      'اطلاعات هویتی: نام، نام خانوادگی، شماره تماس، ایمیل و اطلاعات حساب کاربری.',
      'اطلاعات حرفه‌ای: سوابق کاری، مهارت‌ها، مدارک تحصیلی و محتوای رزومه.',
      'اطلاعات فنی: آدرس IP، نوع مرورگر، دستگاه، زمان بازدید و کوکی‌ها.',
      'اطلاعات تراکنش: سوابق پرداخت برای خدمات پولی (بدون ذخیره اطلاعات کارت بانکی).',
    ],
  },
  {
    id: 'data-usage',
    title: 'نحوه استفاده از اطلاعات',
    paragraphs: ['اطلاعات کاربران برای اهداف زیر استفاده می‌شود:'],
    items: [
      'ارائه و بهبود خدمات پلتفرم، از جمله جست‌وجوی شغلی و ثبت آگهی.',
      'ارتباط میان کارفرمایان و حسابداران در چارچوب خدمات های‌حساب.',
      'پشتیبانی کاربران و پاسخ به درخواست‌ها و سوالات.',
      'ارسال اطلاع‌رسانی‌های مرتبط با حساب کاربری و خدمات.',
      'تحلیل آماری برای بهبود تجربه کاربری (در صورت امکان به‌صورت ناشناس).',
    ],
  },
  {
    id: 'data-sharing',
    title: 'اشتراک‌گذاری اطلاعات',
    paragraphs: [
      'های‌حساب اطلاعات شخصی کاربران را به اشخاص ثالث نمی‌فروشد. اشتراک‌گذاری تنها در موارد زیر انجام می‌شود:',
    ],
    items: [
      'نمایش رزومه یا اطلاعات تماس به کارفرمایان، پس از ارسال درخواست یا رضایت کاربر.',
      'همکاری با ارائه‌دهندگان خدمات فنی (میزبانی، درگاه پرداخت) در چارچوب قرارداد محرمانگی.',
      'پاسخ به درخواست‌های قانونی مراجع ذی‌صلاح.',
    ],
  },
  {
    id: 'data-security',
    title: 'امنیت و نگهداری اطلاعات',
    paragraphs: [
      'های‌حساب از روش‌های فنی و سازمانی مناسب برای محافظت از اطلاعات در برابر دسترسی غیرمجاز، افشا یا تخریب استفاده می‌کند.',
      'اطلاعات تا زمانی که برای ارائه خدمات لازم باشد یا قانوناً ملزم به نگهداری آن باشیم، ذخیره می‌شود. پس از آن، اطلاعات حذف یا ناشناس‌سازی می‌گردد.',
    ],
    items: [
      'رمز عبور به‌صورت رمزنگاری‌شده ذخیره می‌شود.',
      'دسترسی به اطلاعات حساس محدود به پرسنل مجاز است.',
    ],
  },
  {
    id: 'cookies',
    title: 'کوکی‌ها و فناوری‌های مشابه',
    paragraphs: [
      'های‌حساب از کوکی‌ها برای بهبود عملکرد سایت، حفظ وضعیت ورود و تحلیل رفتار کاربران استفاده می‌کند.',
      'می‌توانید کوکی‌ها را از طریق تنظیمات مرورگر غیرفعال کنید، اما برخی امکانات سایت ممکن است به‌درستی کار نکنند.',
    ],
  },
  {
    id: 'user-rights',
    title: 'حقوق شما',
    paragraphs: ['کاربران حق دارند:'],
    items: [
      'به اطلاعات شخصی خود دسترسی داشته و آن‌ها را ویرایش کنند.',
      'درخواست حذف حساب کاربری و اطلاعات مرتبط را ثبت کنند.',
      'از دریافت پیام‌های تبلیغاتی انصراف دهند.',
      'در صورت نقض حریم خصوصی، از طریق صفحه تماس با ما شکایت کنند.',
    ],
  },
  {
    id: 'resume-data',
    title: 'رزومه و داده‌های حرفه‌ای',
    paragraphs: [
      'اطلاعات رزومه و پروفایل حرفه‌ای توسط خود کاربر ثبت می‌شود و مسئولیت صحت آن بر عهده کاربر است.',
      'کارفرمایان تنها به اطلاعاتی دسترسی دارند که کاربر برای آگهی یا پروژه مربوطه در دسترس قرار داده است.',
    ],
    items: [
      'می‌توانید در هر زمان رزومه خود را ویرایش یا حذف کنید.',
      'پس از حذف حساب، اطلاعات عمومی رزومه از نتایج جست‌وجو حذف می‌شود.',
    ],
  },
  {
    id: 'policy-changes',
    title: 'تغییرات در سیاست',
    paragraphs: [
      'های‌حساب ممکن است این سیاست را به‌روزرسانی کند. نسخه جدید در همین صفحه منتشر می‌شود و تاریخ آخرین به‌روزرسانی درج خواهد شد.',
      'ادامه استفاده از خدمات پس از انتشار تغییرات، به منزله پذیرش سیاست جدید است.',
    ],
  },
  {
    id: 'contact',
    title: 'تماس با ما',
    paragraphs: [
      'برای سوالات درباره حریم خصوصی یا درخواست دسترسی و حذف اطلاعات، از طریق صفحه تماس با ما یا ایمیل پشتیبانی hihesabinfo@gmail.com با ما در ارتباط باشید.',
      'تیم پشتیبانی در اسرع وقت پاسخگوی درخواست‌های مرتبط با حریم خصوصی خواهد بود.',
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
  title: 'حریم خصوصی',
  description:
    'سیاست حریم خصوصی پلتفرم های‌حساب — نحوه جمع‌آوری، استفاده و محافظت از اطلاعات کاربران',
})
</script>
