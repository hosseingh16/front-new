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
          سیاست حریم خصوصی های‌حساب
        </h1>
        <p class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary">
          حفظ اطلاعات کاربران برای های‌حساب اهمیت دارد. در این صفحه توضیح می‌دهیم چه
          اطلاعاتی از شما دریافت می‌شود، چرا به آن‌ها نیاز داریم و در چه شرایطی ممکن
          است در اختیار سایر کاربران یا ارائه‌دهندگان خدمات قرار گیرد.
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
    id: 'data-collection',
    title: '۱. چه اطلاعاتی جمع‌آوری می‌کنیم؟',
    paragraphs: [
      'متناسب با نوع استفاده شما از های‌حساب، ممکن است اطلاعاتی مانند موارد زیر دریافت شود:',
    ],
    items: [
      'شماره موبایل و اطلاعات حساب کاربری',
      'نام و اطلاعات هویتی مورد نیاز',
      'اطلاعات تحصیلی، شغلی و مهارت‌های کارجویان',
      'رزومه و فایل‌های بارگذاری‌شده',
      'اطلاعات کسب‌وکار و آگهی‌های استخدام یا پروژه',
      'اطلاعات مورد نیاز برای ثبت درخواست مشاوره',
      'اطلاعات فنی مانند نوع دستگاه، مرورگر، IP و نحوه استفاده از سایت',
    ],
  },
  {
    id: 'data-usage',
    title: '۲. چرا این اطلاعات را دریافت می‌کنیم؟',
    paragraphs: [
      'اطلاعات کاربران برای مواردی مانند ارائه خدمات سایت، ساخت رزومه، ارسال درخواست شغلی، ثبت و مدیریت آگهی، اتصال متقاضیان به مشاور، پشتیبانی، افزایش امنیت و بهبود تجربه کاربری استفاده می‌شود.',
      'اطلاعات فقط در حد مورد نیاز برای ارائه و بهبود خدمات پردازش خواهد شد.',
    ],
  },
  {
    id: 'resume-visibility',
    title: '۳. اطلاعات رزومه چگونه نمایش داده می‌شود؟',
    paragraphs: [
      'هنگامی که کارجو برای یک فرصت شغلی درخواست ارسال می‌کند، اطلاعات رزومه او در اختیار کارفرمای مربوط به آن آگهی قرار می‌گیرد.',
      'همچنین در صورت قرار گرفتن رزومه در بانک رزومه، کارفرمایانی که طبق شرایط های‌حساب به بانک رزومه دسترسی دارند می‌توانند اطلاعات حرفه‌ای کارجو را مشاهده کنند.',
    ],
  },
  {
    id: 'consulting-requests',
    title: '۴. اطلاعات درخواست مشاوره چگونه استفاده می‌شود؟',
    paragraphs: [
      'هنگام ثبت درخواست مشاوره یا انجام خدمات مالیاتی، تنها اطلاعات اولیه و توضیح مختصری درباره نیاز کسب‌وکار یا متقاضی از طریق های‌حساب دریافت می‌شود. این اطلاعات برای بررسی درخواست و اتصال متقاضی به مشاور مناسب استفاده خواهد شد.',
      'های‌حساب از متقاضی مدارک مالی، مالیاتی یا اسناد پرونده دریافت نمی‌کند.',
      'پس از برقراری ارتباط با مشاور، ارائه مدارک، اطلاعات تکمیلی، بررسی پرونده و ادامه فرآیند مستقیماً میان متقاضی و مشاور انجام می‌شود.',
      'های‌حساب پس از ایجاد این ارتباط، در فرایند تبادل مدارک، بررسی پرونده و نحوه انجام خدمت توسط مشاور دخالتی ندارد و مسئولیت صحت اطلاعات ارائه‌شده از سوی متقاضی و نحوه ارائه خدمت تخصصی بر عهده طرفین مربوط خواهد بود.',
    ],
  },
  {
    id: 'data-sharing',
    title: '۵. آیا اطلاعات کاربران در اختیار دیگران قرار می‌گیرد؟',
    paragraphs: [
      'های‌حساب اطلاعات کاربران را برای اهداف غیر مرتبط به اشخاص دیگر واگذار نمی‌کند.',
      'با این حال، در موارد ضروری ممکن است اطلاعات در اختیار کارفرمایی که کارجو برای آگهی او درخواست ارسال کرده، مشاور مرتبط با درخواست کاربر، ارائه‌دهندگان فنی مورد نیاز برای اجرای سرویس یا مراجع قانونی در صورت وجود الزام قانونی قرار گیرد.',
    ],
  },
  {
    id: 'technical-data',
    title: '۶. اطلاعات فنی و نحوه استفاده از سایت',
    paragraphs: [
      'ممکن است برای بررسی عملکرد سایت، تحلیل رفتار کاربران، رفع خطاها و بهبود تجربه کاربری از ابزارهای تحلیلی و داده‌های فنی استفاده شود.',
      'این اطلاعات می‌تواند شامل صفحات مشاهده‌شده، زمان استفاده، نوع دستگاه، مرورگر و اطلاعات فنی مشابه باشد.',
    ],
  },
  {
    id: 'data-protection',
    title: '۷. حفاظت از اطلاعات',
    paragraphs: [
      'های‌حساب اقدامات فنی و مدیریتی متعارفی برای جلوگیری از دسترسی، تغییر، افشا یا استفاده غیرمجاز از اطلاعات کاربران انجام می‌دهد.',
      'با این حال، هیچ سامانه اینترنتی نمی‌تواند امنیت مطلق اطلاعات را تضمین کند.',
    ],
  },
  {
    id: 'data-edit',
    title: '۸. ویرایش اطلاعات',
    paragraphs: [
      'کاربران می‌توانند اطلاعات قابل ویرایش حساب کاربری و رزومه خود را از طریق پنل کاربری اصلاح یا به‌روزرسانی کنند.',
      'برای درخواست‌های دیگری که امکان انجام مستقیم آن‌ها از طریق پنل وجود ندارد، می‌توانید با پشتیبانی های‌حساب در ارتباط باشید.',
    ],
  },
  {
    id: 'data-retention',
    title: '۹. نگهداری اطلاعات',
    paragraphs: [
      'اطلاعات کاربران تا زمانی که برای ارائه خدمات، انجام تعهدات، رسیدگی به درخواست‌ها یا رعایت الزامات قانونی مورد نیاز باشد نگهداری خواهد شد.',
      'پس از پایان ضرورت نگهداری، اطلاعات مطابق الزامات فنی و قانونی حذف یا ناشناس‌سازی خواهد شد.',
    ],
  },
  {
    id: 'policy-changes',
    title: '۱۰. تغییر سیاست حریم خصوصی',
    paragraphs: [
      'ممکن است این سیاست متناسب با تغییر خدمات های‌حساب یا الزامات قانونی به‌روزرسانی شود. نسخه جدید همیشه از طریق همین صفحه در دسترس خواهد بود.',
    ],
  },
  {
    id: 'contact',
    title: '۱۱. ارتباط با ما',
    paragraphs: [
      'اگر درباره نحوه جمع‌آوری، استفاده یا نگهداری اطلاعات خود سؤال یا درخواستی دارید، می‌توانید از طریق راه‌های ارتباطی رسمی های‌حساب با پشتیبانی در ارتباط باشید.',
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
  title: 'سیاست حریم خصوصی های‌حساب',
  description:
    'حفظ اطلاعات کاربران برای های‌حساب اهمیت دارد. در این صفحه توضیح می‌دهیم چه اطلاعاتی از شما دریافت می‌شود، چرا به آن‌ها نیاز داریم و در چه شرایطی ممکن است در اختیار سایر کاربران یا ارائه‌دهندگان خدمات قرار گیرد.',
})
</script>
