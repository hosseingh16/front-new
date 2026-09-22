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
          قوانین و مقررات خدمات اظهارنامه عملکرد
        </h1>
        <p class="mt-4 max-w-3xl text-center text-[18px] leading-8 text-text-tertiary">
          ثبت درخواست اظهارنامه یا انتخاب مشاور در های‌حساب به معنای مطالعه و
          پذیرش این قوانین است. لطفاً پیش از ادامه، موارد زیر را مطالعه کنید.
        </p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="custom-pad pb-12">
      <div class="rounded-2xl py-6 md:py-10">
        <div
          class="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-8"
        >
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
                <p
                  v-for="(paragraph, index) in section.paragraphs"
                  :key="index"
                >
                  {{ paragraph }}
                </p>
                <ul
                  v-if="section.items?.length"
                  class="list-disc space-y-2 pr-5"
                >
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
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
  afterParagraphs?: string[];
};

const sections: TermsSection[] = [
  {
    id: "about",
    title: "۱. درباره خدمت اظهارنامه",
    paragraphs: [
      "خدمات اظهارنامه عملکرد در های‌حساب برای اتصال کسب‌وکارها و متقاضیان به مشاوران مالی و مالیاتی تأییدشده طراحی شده است.",
      "از طریق این خدمت می‌توانید درخواست مشاوره یا انجام و ارسال اظهارنامه عملکرد را ثبت کنید تا مشاور منتخب فرآیند را پیگیری کند.",
    ],
  },
  {
    id: "platform-role",
    title: "۲. نقش های‌حساب",
    paragraphs: [
      "های‌حساب بستر ارتباطی میان متقاضی و مشاور است و جز در مواردی که صراحتاً اعلام شده باشد، ارائه‌دهنده مستقیم خدمات تخصصی مالیاتی محسوب نمی‌شود.",
      "انتخاب مشاور، تبادل مدارک و انجام خدمت تخصصی توسط مشاور تأییدشده انجام می‌شود.",
    ],
  },
  {
    id: "request",
    title: "۳. ثبت درخواست",
    paragraphs: [
      "برای ثبت درخواست اظهارنامه، وارد کردن اطلاعات هویتی، شماره تماس و شرح فعالیت الزامی است.",
      "مسئولیت صحت اطلاعاتی که در فرم درخواست وارد می‌شود بر عهده متقاضی است.",
      "ثبت درخواست اولیه به معنای شروع قطعی همکاری یا پرداخت هزینه نیست، مگر آنکه در همان مرحله هزینه خدمت نمایش داده شده و پرداخت شده باشد.",
    ],
  },
  {
    id: "consultant",
    title: "۴. انتخاب مشاور",
    paragraphs: [
      "متقاضی می‌تواند از میان مشاوران تأییدشده های‌حساب، مشاور مورد نظر خود را انتخاب کند.",
      "نرخ اعلام‌شده برای هر مشاور شامل دو بخش مستقل است: نرخ دریافت مشاوره و نرخ انجام و ارسال اظهارنامه.",
      "انتخاب مشاور به معنای تضمین نتیجه مشخص پرونده مالیاتی نیست و همکاری نهایی پس از هماهنگی طرفین شکل می‌گیرد.",
    ],
  },
  {
    id: "services",
    title: "۵. مشاوره و انجام اظهارنامه",
    paragraphs: [
      "دریافت مشاوره و انجام اظهارنامه دو خدمت مستقل هستند.",
      "هزینه مشاوره جزو هزینه انجام اظهارنامه محسوب نمی‌شود، مگر آنکه در شرایط همان خدمت به‌صورت دیگری اعلام شده باشد.",
      "پس از ثبت درخواست، مشاور می‌تواند برای بررسی اولیه، هماهنگی مدارک و ادامه فرایند با متقاضی تماس بگیرد.",
    ],
  },
  {
    id: "pricing",
    title: "۶. نرخ انجام اظهارنامه",
    paragraphs: [
      "نرخ انجام اظهارنامه بر اساس میزان گردش مالی کسب‌وکار در سه سطح تعیین می‌شود:",
    ],
    items: [
      "کسب‌وکارهای با گردش مالی کمتر از ۳۰ میلیارد تومان",
      "کسب‌وکارهای با گردش مالی بین ۳۰ تا ۷۵ میلیارد تومان",
      "کسب‌وکارهای با گردش مالی بیش از ۷۵ میلیارد تومان",
    ],
    afterParagraphs: [
      "نرخ هر سطح توسط مشاور اعلام می‌شود و متقاضی می‌تواند پیش از ثبت درخواست یا انتخاب مشاور، هزینه مربوط به خدمت را مشاهده کند.",
    ],
  },
  {
    id: "user-responsibility",
    title: "۷. تعهدات متقاضی",
    paragraphs: ["متقاضی متعهد می‌شود:"],
    items: [
      "اطلاعات هویتی، تماس و شرح فعالیت را صحیح وارد کند.",
      "مدارک و اطلاعات مالی یا مالیاتی مورد نیاز را کامل، صحیح و در زمان مناسب در اختیار مشاور قرار دهد.",
      "از اطلاعات مشاور صرفاً برای اهداف مرتبط با همان درخواست استفاده کند.",
      "هزینه خدمت انتخاب‌شده را مطابق تعرفه اعلام‌شده پرداخت کند.",
    ],
    afterParagraphs: [
      "ناقص یا نادرست بودن مدارک می‌تواند باعث تأخیر، ناقص ماندن اظهارنامه یا نیاز به اصلاح مجدد شود و مسئولیت آن بر عهده متقاضی است.",
    ],
  },
  {
    id: "consultant-responsibility",
    title: "۸. تعهدات مشاور",
    paragraphs: [
      "مشاور مسئول ارائه صحیح خدمات تخصصی خود، از جمله بررسی مدارک، تنظیم و در صورت توافق ارسال اظهارنامه است.",
      "مشاور باید نرخ اعلام‌شده را رعایت کند و پیش از شروع خدمت، نوع خدمت و هزینه را برای متقاضی شفاف کند.",
      "اطلاعات و اسناد دریافتی از متقاضی باید محرمانه نگهداری شود و فقط برای انجام همان درخواست استفاده گردد.",
    ],
  },
  {
    id: "payments",
    title: "۹. هزینه خدمات و پرداخت",
    paragraphs: [
      "مبلغ قابل پرداخت بر اساس نرخ اعلام‌شده توسط مشاور و نوع خدمت انتخابی (مشاوره یا انجام اظهارنامه) مشخص می‌شود.",
      "پرداخت هزینه به معنای پذیرش شرایط همان خدمت است.",
      "شرایط لغو، بازگشت وجه یا تغییر درخواست، بر اساس نوع خدمت و شرایط اعلام‌شده در زمان خرید یا ثبت درخواست تعیین خواهد شد.",
    ],
  },
  {
    id: "privacy",
    title: "۱۰. محرمانگی اطلاعات",
    paragraphs: [
      "اطلاعات مالی، هویتی و اسناد مالیاتی متقاضی با رعایت اصول محرمانگی بررسی می‌شود و تنها در اختیار مشاور مربوط به همان درخواست قرار می‌گیرد.",
      "های‌حساب و مشاور حق انتشار یا استفاده غیرمجاز از این اطلاعات را ندارند.",
    ],
  },
  {
    id: "limitations",
    title: "۱۱. محدودیت مسئولیت",
    paragraphs: [
      "های‌حساب نتیجه مشخصی از جمله میزان مالیات، پذیرش اظهارنامه، نتیجه رسیدگی یا نتیجه پرونده مالیاتی را تضمین نمی‌کند.",
      "همچنین های‌حساب تضمین‌کننده انعقاد قرارداد میان متقاضی و مشاور یا فعالیت بدون وقفه پلتفرم نیست.",
    ],
  },
  {
    id: "changes",
    title: "۱۲. تغییر قوانین",
    paragraphs: [
      "های‌حساب ممکن است متناسب با تغییر خدمات اظهارنامه، الزامات قانونی یا شرایط پلتفرم این قوانین را به‌روزرسانی کند. نسخه جدید از طریق همین صفحه در دسترس قرار خواهد گرفت.",
    ],
  },
  {
    id: "contact",
    title: "۱۳. ارتباط با های‌حساب",
    paragraphs: [
      "در صورت وجود سؤال، اعتراض یا مشکل درباره درخواست اظهارنامه، پرداخت یا حساب کاربری، می‌توانید از طریق راه‌های ارتباطی رسمی اعلام‌شده در وب‌سایت با پشتیبانی های‌حساب در ارتباط باشید.",
    ],
  },
];

const activeSection = ref(sections[0]?.id ?? "");

function scrollToSection(id: string) {
  const element = document.getElementById(id);
  if (!element) return;

  activeSection.value = id;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
}

onMounted(() => {
  const hash = window.location.hash.replace("#", "");
  if (hash && sections.some((section) => section.id === hash)) {
    nextTick(() => scrollToSection(hash));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]?.target.id) {
        activeSection.value = visible[0].target.id;
      }
    },
    {
      rootMargin: "-120px 0px -60% 0px",
      threshold: [0, 0.25, 0.5, 1],
    },
  );

  sections.forEach((section) => {
    const element = document.getElementById(section.id);
    if (element) observer.observe(element);
  });

  onUnmounted(() => observer.disconnect());
});

useSeoMeta({
  title: "قوانین و مقررات خدمات اظهارنامه عملکرد | های‌حساب",
  description:
    "شرایط ثبت درخواست اظهارنامه عملکرد، انتخاب مشاور، نرخ مشاوره و انجام اظهارنامه، تعهدات متقاضی و محدودیت مسئولیت های‌حساب را مطالعه کنید.",
});
</script>
