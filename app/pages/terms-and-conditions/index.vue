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
          قوانین و مقررات استفاده از های‌حساب
        </h1>
        <p class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary">
          استفاده از وب‌سایت و خدمات «های‌حساب» به معنای مطالعه و پذیرش این قوانین
          است. لطفاً پیش از استفاده از خدمات، موارد زیر را مطالعه کنید.
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
                <p
                  v-for="(paragraph, index) in section.afterParagraphs"
                  :key="`after-${index}`"
                >
                  {{ paragraph }}
                </p>
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
  afterParagraphs?: string[]
}

const sections: TermsSection[] = [
  {
    id: 'about',
    title: '۱. درباره های‌حساب',
    paragraphs: [
      'های‌حساب یک پلتفرم تخصصی حوزه حسابداری است که امکان ارتباط میان کارجویان، کسب‌وکارها، کارفرمایان، متقاضیان پروژه‌های حسابداری و مشاوران مالی و مالیاتی را فراهم می‌کند.',
      'های‌حساب در فرآیند استخدام، انجام پروژه یا ارائه خدمات مالی و مالیاتی، نقش بستر ارتباطی را دارد و جز در مواردی که صراحتاً اعلام شده باشد، طرف قرارداد استخدامی یا ارائه‌دهنده مستقیم خدمات تخصصی محسوب نمی‌شود.',
    ],
  },
  {
    id: 'account',
    title: '۲. حساب کاربری',
    paragraphs: [
      'برای استفاده از برخی خدمات های‌حساب، ثبت شماره موبایل و ایجاد حساب کاربری الزامی است.',
      'کاربر مسئول صحت اطلاعاتی است که هنگام ثبت‌نام یا استفاده از خدمات وارد می‌کند و نباید حساب کاربری خود را در اختیار دیگران قرار دهد.',
    ],
  },
  {
    id: 'job-ads',
    title: '۳. ثبت آگهی استخدام و پروژه',
    paragraphs: [
      'کسب‌وکارها می‌توانند متناسب با نیاز خود، آگهی استخدام حسابدار یا پروژه حسابداری ثبت کنند.',
      'مسئولیت صحت اطلاعات مربوط به موقعیت شغلی، شرایط همکاری، حقوق و مزایا، شرح پروژه و سایر اطلاعات ثبت‌شده بر عهده ثبت‌کننده آگهی است.',
      'های‌حساب بستر ارتباط میان کارفرما، کارجو و مجریان پروژه را فراهم می‌کند؛ با این حال، نتیجه نهایی فرآیند استخدام، تعداد رزومه‌های دریافتی یا انتخاب مجری پروژه به شرایط آگهی، نیاز بازار و تصمیم کاربران بستگی دارد.',
    ],
  },
  {
    id: 'resume-jobs',
    title: '۴. رزومه و فرصت‌های شغلی',
    paragraphs: [
      'کارجویان می‌توانند از رزومه‌ساز های‌حساب استفاده کنند یا رزومه خود را بارگذاری کنند. برای ارسال درخواست به فرصت‌های شغلی، تکمیل اطلاعات ضروری تعیین‌شده توسط های‌حساب الزامی است.',
      'مسئولیت صحت سوابق کاری، تحصیلی، مهارت‌ها و سایر اطلاعات رزومه بر عهده کارجو است.',
      'ارسال درخواست برای یک آگهی به معنای تضمین دعوت به مصاحبه یا استخدام نیست.',
    ],
  },
  {
    id: 'resume-bank',
    title: '۵. بانک رزومه',
    paragraphs: [
      'کارفرمایانی که آگهی استخدام فعال منتشر کرده‌اند، مطابق شرایط اعلام‌شده توسط های‌حساب می‌توانند به بانک رزومه دسترسی داشته باشند.',
      'اطلاعات موجود در بانک رزومه صرفاً باید برای اهداف مرتبط با استخدام و جذب نیروی انسانی استفاده شود و استفاده تجاری، انتشار یا انتقال غیرمجاز این اطلاعات مجاز نیست.',
    ],
  },
  {
    id: 'consulting',
    title: '۶. مشاوره و خدمات مالی و مالیاتی',
    paragraphs: [
      'کسب‌وکارها و سایر متقاضیان می‌توانند از طریق های‌حساب درخواست مشاوره یا انجام خدماتی مانند بررسی، تنظیم و ارسال اظهارنامه را ثبت کنند.',
      'های‌حساب متقاضی را به مشاوران تأییدشده متصل می‌کند و ارائه خدمت تخصصی توسط مشاور انجام می‌شود.',
      'هر مشاور در های‌حساب دو نرخ مجزا اعلام می‌کند: نرخ دریافت مشاوره و نرخ انجام و ارسال اظهارنامه. این دو خدمت مستقل از یکدیگر هستند و هزینه مشاوره جزو هزینه انجام اظهارنامه محسوب نمی‌شود، مگر آنکه در شرایط همان خدمت به‌صورت دیگری اعلام شده باشد.',
      'نرخ انجام اظهارنامه بر اساس میزان گردش مالی کسب‌وکار در سه سطح تعیین می‌شود:',
    ],
    items: [
      'کسب‌وکارهای با گردش مالی کمتر از ۳۰ میلیارد تومان',
      'کسب‌وکارهای با گردش مالی بین ۳۰ تا ۷۵ میلیارد تومان',
      'کسب‌وکارهای با گردش مالی بیش از ۷۵ میلیارد تومان',
    ],
    afterParagraphs: [
      'نرخ هر سطح توسط مشاور اعلام می‌شود و متقاضی می‌تواند پیش از ثبت درخواست یا انتخاب مشاور، هزینه مربوط به خدمت را مشاهده کند.',
      'مشاور مسئول ارائه صحیح خدمات تخصصی خود است و متقاضی نیز مسئول ارائه اطلاعات و مدارک صحیح و کامل درباره پرونده خواهد بود.',
      'های‌حساب نتیجه مشخصی از جمله میزان مالیات، پذیرش اظهارنامه، نتیجه رسیدگی یا نتیجه پرونده مالیاتی را تضمین نمی‌کند.',
    ],
  },
  {
    id: 'payments',
    title: '۷. هزینه خدمات و پرداخت',
    paragraphs: [
      'هزینه هر یک از خدمات های‌حساب مطابق تعرفه‌ای است که هنگام ثبت سفارش یا درخواست به کاربر نمایش داده می‌شود.',
      'در خدمات مشاوره و اظهارنامه، مبلغ قابل پرداخت بر اساس نرخ اعلام‌شده توسط مشاور و نوع خدمت انتخابی مشخص خواهد شد.',
      'پرداخت هزینه به معنای پذیرش شرایط همان خدمت است. شرایط لغو، بازگشت وجه یا تغییر درخواست، بر اساس نوع خدمت و شرایط اعلام‌شده در زمان خرید یا ثبت درخواست تعیین خواهد شد.',
    ],
  },
  {
    id: 'user-responsibility',
    title: '۸. مسئولیت کاربران',
    paragraphs: ['کاربران متعهد می‌شوند:'],
    items: [
      'اطلاعات صحیح و متعلق به خود را ثبت کنند.',
      'از اطلاعات سایر کاربران سوءاستفاده نکنند.',
      'محتوای خلاف قانون یا حقوق اشخاص ثالث منتشر نکنند.',
      'از اطلاعات رزومه‌ها فقط برای اهداف استخدامی استفاده کنند.',
      'مدارک و اطلاعات مالی یا مالیاتی صحیح در اختیار مشاور قرار دهند.',
    ],
    afterParagraphs: [
      'در صورت مشاهده تخلف، های‌حساب می‌تواند دسترسی کاربر یا محتوای ثبت‌شده را محدود یا غیرفعال کند.',
    ],
  },
  {
    id: 'platform-responsibility',
    title: '۹. مسئولیت های‌حساب',
    paragraphs: [
      'های‌حساب تلاش می‌کند خدمات پلتفرم با کیفیت و دسترس‌پذیری مناسب ارائه شود، اما تضمینی برای فعالیت بدون وقفه یا بدون خطای فنی وجود ندارد.',
      'همچنین های‌حساب تضمین‌کننده انعقاد قرارداد میان کاربران، استخدام کارجو، موفقیت پروژه یا نتیجه مشخص یک خدمت مالی یا مالیاتی نیست.',
    ],
  },
  {
    id: 'intellectual-property',
    title: '۱۰. حقوق مالکیت فکری',
    paragraphs: [
      'نام، نشان تجاری، طراحی، محتوا، ساختار و سایر دارایی‌های متعلق به های‌حساب تحت حمایت قوانین مربوطه قرار دارند و استفاده یا بازنشر آن‌ها بدون اجازه مجاز نیست.',
    ],
  },
  {
    id: 'privacy',
    title: '۱۱. حریم خصوصی',
    paragraphs: [
      'اطلاعات کاربران مطابق «سیاست حریم خصوصی های‌حساب» جمع‌آوری و پردازش می‌شود. استفاده از خدمات های‌حساب به معنای پذیرش سیاست حریم خصوصی نیز خواهد بود.',
    ],
  },
  {
    id: 'changes',
    title: '۱۲. تغییر قوانین',
    paragraphs: [
      'های‌حساب ممکن است متناسب با تغییر خدمات، الزامات قانونی یا شرایط پلتفرم این قوانین را به‌روزرسانی کند. نسخه جدید از طریق همین صفحه در دسترس کاربران قرار خواهد گرفت.',
    ],
  },
  {
    id: 'contact',
    title: '۱۳. ارتباط با های‌حساب',
    paragraphs: [
      'در صورت وجود سؤال، اعتراض یا مشکل درباره خدمات یا حساب کاربری، کاربران می‌توانند از طریق راه‌های ارتباطی رسمی اعلام‌شده در وب‌سایت با پشتیبانی های‌حساب در ارتباط باشند.',
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
  title: 'قوانین و مقررات استفاده از های‌حساب',
  description:
    'استفاده از وب‌سایت و خدمات های‌حساب به معنای مطالعه و پذیرش این قوانین است. شرایط حساب کاربری، آگهی استخدام، رزومه، مشاوره و پرداخت را مطالعه کنید.',
})
</script>
