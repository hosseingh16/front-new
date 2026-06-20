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
          شرایط استفاده از خدمات
        </h1>
        <p class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary">
          با استفاده از پلتفرم های‌حساب، شما موافقت خود را با شرایط و قوانین زیر اعلام
          می‌کنید. لطفاً پیش از استفاده از خدمات، این موارد را با دقت مطالعه کنید.
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
type TermsSection = {
  id: string
  title: string
  paragraphs: string[]
  items?: string[]
}

const sections: TermsSection[] = [
  {
    id: 'platform-overview',
    title: 'این پلتفرم چه کاری انجام می‌دهد؟',
    paragraphs: [
      'های‌حساب یک پلتفرم تخصصی برای ارتباط میان کارفرمایان و حسابداران است. این سامانه امکان ثبت آگهی استخدام، جست‌وجوی فرصت‌های شغلی، ساخت رزومه تخصصی و ایجاد پروژه‌های حسابداری را فراهم می‌کند.',
      'هدف های‌حساب تسهیل فرایند استخدام حسابداران حرفه‌ای و ایجاد بستری امن و شفاف برای طرفین معامله است.',
    ],
  },
  {
    id: 'user-types',
    title: 'انواع کاربران',
    paragraphs: ['کاربران های‌حساب به دو دسته اصلی تقسیم می‌شوند:'],
    items: [
      'کارفرما: اشخاص حقیقی یا حقوقی که به دنبال استخدام حسابدار یا ثبت پروژه حسابداری هستند.',
      'حسابدار: افرادی که رزومه خود را ثبت کرده و به دنبال فرصت‌های شغلی یا پروژه‌های حسابداری هستند.',
      'هر کاربر موظف است اطلاعات صحیح و به‌روز در پروفایل خود ثبت کند.',
    ],
  },
  {
    id: 'employment-projects',
    title: 'استخدام و پروژه',
    paragraphs: [
      'کارفرمایان می‌توانند آگهی استخدام یا پروژه حسابداری ثبت کنند. حسابداران نیز می‌توانند برای آگهی‌ها درخواست ارسال کنند.',
      'های‌حساب صرفاً بستر ارتباطی بین طرفین است و مسئولیت نهایی انتخاب، مذاکره و عقد قرارداد بر عهده کاربران می‌باشد.',
    ],
    items: [
      'ثبت آگهی باید مطابق با قوانین جاری کشور باشد.',
      'ارسال درخواست به معنای پذیرش شرایط آگهی نیست.',
      'کارفرما مسئول بررسی صلاحیت و مدارک حسابداران است.',
    ],
  },
  {
    id: 'refund-cancellation',
    title: 'استرداد و لغو',
    paragraphs: [
      'در صورت لغو خدمات پولی پیش از فعال‌سازی، مبلغ پرداختی پس از کسر کارمزد درگاه پرداخت، حداکثر تا ۷۲ ساعت کاری به حساب کاربر بازگردانده می‌شود.',
      'پس از فعال‌سازی آگهی یا خدمات، امکان استرداد وجه وجود ندارد مگر در موارد خاص که توسط پشتیبانی تأیید شود.',
    ],
  },
  {
    id: 'fees-payment',
    title: 'هزینه‌ها و پرداخت',
    paragraphs: [
      'برخی خدمات های‌حساب شامل ثبت آگهی استخدام و امکانات ویژه رزومه‌ساز، مشمول هزینه می‌باشند. تعرفه‌ها در صفحات مربوطه به‌صورت شفاف نمایش داده می‌شود.',
    ],
    items: [
      'پرداخت‌ها از طریق درگاه‌های معتبر بانکی انجام می‌شود.',
      'های‌حساب اطلاعات کارت بانکی کاربران را ذخیره نمی‌کند.',
      'فاکتور رسمی در صورت درخواست کاربر صادر می‌شود.',
    ],
  },
  {
    id: 'content-rules',
    title: 'قوانین محتوا',
    paragraphs: [
      'کاربران موظفند از انتشار محتوای خلاف قوانین، توهین‌آمیز، گمراه‌کننده یا مغایر با شئونات اسلامی خودداری کنند.',
    ],
    items: [
      'ثبت اطلاعات نادرست یا جعلی ممنوع است.',
      'کپی‌برداری از آگهی یا رزومه دیگران بدون اجازه مجاز نیست.',
      'های‌حساب حق حذف محتوای متخلف را بدون اطلاع قبلی دارد.',
    ],
  },
  {
    id: 'resume-user-info',
    title: 'رزومه و اطلاعات کاربران',
    paragraphs: [
      'اطلاعات ثبت‌شده در رزومه و پروفایل کاربران، در اختیار کارفرمایانی قرار می‌گیرد که درخواست مشاهده ارسال کرده‌اند.',
      'کاربران مسئول صحت اطلاعات مهارت‌ها، سوابق کاری و مدارک تحصیلی خود هستند.',
    ],
    items: [
      'های‌حساب از اطلاعات کاربران مطابق سیاست حفظ حریم خصوصی محافظت می‌کند.',
      'کاربران می‌توانند در هر زمان پروفایل خود را ویرایش یا حذف کنند.',
    ],
  },
  {
    id: 'support-guide',
    title: 'راهنمایی پشتیبانی',
    paragraphs: [
      'تیم پشتیبانی های‌حساب از طریق صفحه تماس با ما، ایمیل و تلفن، پاسخگوی سوالات کاربران است.',
      'ساعات پاسخگویی پشتیبانی ۲۴ ساعته در ۷ روز هفته می‌باشد. درخواست‌های پیچیده ممکن است تا ۴۸ ساعت کاری زمان ببرد.',
    ],
  },
  {
    id: 'responsibilities',
    title: 'مسئولیت‌ها',
    paragraphs: [
      'های‌حساب مسئولیت مستقیمی در قبال کیفیت کار، تعهدات مالی یا اختلافات میان کارفرما و حسابدار ندارد.',
      'کاربران مسئول حفظ امنیت حساب کاربری و رمز عبور خود هستند.',
    ],
    items: [
      'هرگونه سوءاستفاده از حساب کاربری بر عهده صاحب حساب است.',
      'های‌حساب در قبال اختلالات موقت سرویس مسئولیت جبران خسارت ندارد.',
    ],
  },
  {
    id: 'violations',
    title: 'تخلف',
    paragraphs: [
      'در صورت تخلف از شرایط استفاده، های‌حساب حق تعلیق یا حذف حساب کاربری را بدون اطلاع قبلی دارد.',
      'تخلفات شامل ثبت اطلاعات نادرست، کلاهبرداری، آزار کاربران دیگر و نقض قوانین محتوا می‌شود.',
      'در موارد جدی، اطلاعات متخلف به مراجع قانونی ارجاع داده خواهد شد.',
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
  title: 'شرایط استفاده از خدمات',
  description:
    'شرایط و قوانین استفاده از خدمات پلتفرم های‌حساب — استخدام حسابدار، رزومه‌ساز و پروژه‌های حسابداری',
})
</script>
