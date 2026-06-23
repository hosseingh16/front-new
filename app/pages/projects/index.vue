<template>
  <div class="bg-surface-50">
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-5.png')] bg-no-repeat bg-top pb-10 md:pb-16 pt-12 md:pt-20"
    >
      <div class="custom-pad flex flex-col items-center">
        <span
          class="inline-flex items-center rounded-xl bg-[#4864E114] px-4 py-2 text-sm font-semibold text-primary-500"
        >
        ثبت پروژه
      </span>
        <h1
          class="mt-6 max-w-4xl text-center font-yb-bold text-2xl leading-10 text-text-tertiary md:text-h1"
        >
          پروژه‌ات رو ثبت کن یا پروژه مناسب پیدا کن
        </h1>
        <p
          class="mt-4 max-w-3xl text-center text-base font-semibold leading-8 text-text-tertiary md:text-lg"
        >
          شما برای کدام هدف اینجا هستید؟
        </p>
        <div
          class="mt-10 flex w-full max-w-5xl flex-col items-center gap-4 md:flex-row md:items-stretch md:gap-6"
        >
          <div
            class="flex w-full flex-1 flex-col rounded-2xl bg-[#F6F8FE] p-5 shadow-[0px_4px_20px_0px_#4864E114] md:p-6"
          >
            <img
              :src="heroImage2"
              alt="ثبت پروژه حسابداری"
              class="mx-auto h-[120px] w-full max-w-[280px] object-contain md:h-[140px]"
            />
            <p class="mt-5 text-center font-yb-bold text-base text-text-tertiary md:text-lg">
              می‌خواهید پروژه ثبت کنید؟
            </p>
            <p class="mt-5 text-center font-light text-base text-text-tertiary md:text-md">
              پروژه خود را ثبت کنید و متخصص مناسب پیدا کنید.
            </p>
            <NuxtLink to="/account" class="mt-auto pt-6 flex justify-center">
              <button class="btn btn-primary gap-2">
                ثبت پروژه حسابداری
              </button>
            </NuxtLink>
          </div>

          <img
            :src="heroIcon"
            alt=""
            class="hidden w-14 shrink-0 md:block"
          />

          <div
            class="flex w-full flex-1 flex-col rounded-2xl bg-[#FFFAF5] p-5 shadow-[0px_4px_20px_0px_#B95C0414] md:p-6"
          >
            <img
              :src="heroImage1"
              alt="دریافت پروژه حسابداری"
              class="mx-auto h-[120px] w-full max-w-[280px] object-contain md:h-[140px]"
            />
            <p class="mt-5 text-center font-yb-bold text-base text-text-tertiary md:text-lg">
              دریافت پروژه حسابداری
            </p>
            <p class="mt-5 text-center font-light text-base text-text-tertiary md:text-md">
پروژه‌های جدید را مشاهده و درخواست همکاری ارسال کنید.
            </p>
            <NuxtLink to="/account" class="mt-auto pt-6 flex justify-center">
              <button class="btn btn-primary gap-2">
                مشاهده پروژه‌ها
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Categories -->
    <section class="custom-pad  pb-12 md:pb-16">
      <m-calc-divider class="my-6" />
      

    </section>

    <!-- Latest Projects -->
    <section class="custom-pad bg-surface-100 py-12 md:py-16">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <Icon name="svg:projects-1" size="24" class="text-primary-500" />
          <h2 class="font-yb-bold text-lg text-text-tertiary md:text-xl">
            جدیدترین پروژه‌های حسابداری
          </h2>
        </div>
        <button
          class="btn btn-ghost h-auto min-h-0 border-none px-0 text-sm font-semibold text-primary-500 max-sm:hidden"
          @click="navigateTo('/jobs')"
        >
          مشاهده همه
          <icons-arrow color="#4864e1" :size="15" class="mr-1" />
        </button>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ItemBox
          v-for="project in projects"
          :key="project.id"
          variant="project"
          :item="project"
          @bookmark="toggleBookmark"
        />
      </div>
    </section>

    <!-- Articles -->
    <section class="custom-pad bg-surface-100 py-12 md:py-16">
      <m-calc-divider class="mb-6" />
      <div class="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div class="shrink-0 lg:w-80">
          <h2 class="font-yb-bold text-2xl leading-10 text-text-tertiary">
            انتخاب هوشمندانه کسب‌وکارها و حسابداران
          </h2>
          <p class="mt-4 font-semibold text-text-passive">
            آموزشی - خبری - مسیرشغلی
          </p>
        </div>

        <div class="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
          <div
            v-for="(post, index) in posts.slice(0, 3)"
            :key="index"
            class="flex flex-col rounded-xl border border-[#E8E8E8] bg-white p-5"
          >
            <span
              class="inline-flex w-fit rounded-lg px-3 py-1 text-xs font-semibold"
              :class="post.badgeClass"
            >
              {{ post.badgeTitle }}
            </span>
            <p class="mt-4 font-yb-bold text-md leading-7 text-text-tertiary">
              {{ post.title }}
            </p>
            <p
              class="mt-3 line-clamp-4 flex-1 text-caption leading-6 text-text-passive"
              v-html="post.excerpt"
            />
            <div class="mt-5">
              <NuxtLink v-if="post.link" :to="post.link" target="_blank">
                <button class="btn border-none h-8 text-md text-primary-500 bg-[#4864E114] p-4 w-full">
                  {{ post.btnText }}
                  <icons-arrow color="#4864e1" :size="14" class="mr-1 rotate-45" />
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <TrustBar
      :stats="trustBarStats"
    />

    <Testimonials
      badge="تجربه کاربران ما"
      title="نظرات کسانی که تجربه واقعی استفاده از پلتفرم ما را داشته‌اند"
      subtitle="نظرات کارفرمایان و حسابدارانی که با های‌حساب در پروژه‌ها همکاری کرده‌اند"
      :testimonials="testimonials"
      section-class="pb-4 pt-10"
    />

    <m-calc-divider class="mb-6" />
    <!-- FAQ -->
    <FaqSection :categories="faqCategories" :items="faqs" />

  </div>
</template>

<script setup lang="ts">
import pattern from '~/assets/vectors/pages/projects/Pattern.svg'
import heroIcon from '~/assets/vectors/pages/projects/hero-icon.svg'
import heroImage1 from '~/assets/vectors/pages/projects/hero-image-1.webp'
import heroImage2 from '~/assets/vectors/pages/projects/hero-image-2.webp'
import ItemBox from '~/components/Elements/item-box.vue'
import Testimonials from '~/components/Elements/Testimonials.vue'
import TrustBar from '~/components/Elements/TrustBar.vue'
import type { Testimonial } from '~/components/Elements/Testimonials.vue'
import type { ApiResponse } from '~/types/api'
import type { ProjectList } from '~/types/project'
import FaqSection from '~/components/Elements/FaqSection.vue'

const trustBarStats = [
  { value: 43000, label: 'پروژه اخیر' },
  { value: 32000, label: 'متخصص و حسابدار' },
]

const testimonials: Testimonial[] = [
  {
    text: 'ثبت پروژه حسابداری در های‌حساب برای ما بسیار ساده بود. در کمتر از یک هفته چند پیشنهاد حرفه‌ای دریافت کردیم و با بهترین گزینه وارد همکاری شدیم.',
    name: 'فرزاد فرحزاد',
    role: 'مدیر منابع انسانی موسسه کاسپین',
    image: 'bank3.png',
    avatarClass: 'from-[#FFE68C] to-[#FFF5CC] p-0',
  },
  {
    text: 'به‌عنوان حسابدار پروژه‌ای، دسترسی به پروژه‌های متنوع و فیلترشده باعث شد سریع‌تر همکاری‌های مناسب پیدا کنم و درآمد پایدارتری داشته باشم.',
    name: 'مریم یاوری',
    role: 'حسابدار پروژه‌ای',
    image: 'bank1.png',
    avatarClass: 'from-[#AFAAD4] to-[#FFFFFF] p-2',
    imageClass: 'w-[80%]',
  },
  {
    text: 'فیلترهای تخصصی پروژه‌ها کمک کرد دقیقاً پروژه‌ای را پیدا کنیم که با نیاز تیم مالی ما هم‌خوان بود. فرآیند همکاری هم شفاف و قابل پیگیری بود.',
    name: 'مسعود شاه‌مرادی',
    role: 'بنیان‌گذار خانومی',
    image: 'bank2.png',
    avatarClass: 'from-[#82E8F2] to-[#FFFFFF] p-2',
  },
]

const faqCategories = [
  { id: 1, label: 'کارفرمایان' },
  { id: 2, label: 'حسابداران' },
]

const faqs = [
  {
    type: 1,
    question: 'چگونه می‌توانم پروژه حسابداری ثبت کنم؟',
    answer:
      'پس از ثبت‌نام به‌عنوان کارفرما، از بخش داشبورد می‌توانید پروژه جدید ایجاد کنید و نوع نیاز، بودجه و زمان‌بندی مورد نظر را مشخص نمایید.',
  },
  {
    type: 1,
    question: 'چقدر طول می‌کشد تا پیشنهاد همکاری دریافت کنم؟',
    answer:
      'معمولاً پس از انتشار پروژه، پیشنهادهای مرتبط در همان روزهای اول ارسال می‌شوند. سرعت وابسته به نوع پروژه و شرایط بازار است.',
  },
  {
    type: 1,
    question: 'هزینه ثبت پروژه چقدر است؟',
    answer:
      'هزینه‌ها بر اساس نوع پروژه و خدمات انتخابی متفاوت است. جزئیات قیمت‌گذاری در بخش ثبت پروژه نمایش داده می‌شود.',
  },
  {
    type: 1,
    question: 'آیا می‌توانم حسابدار را قبل از شروع همکاری بررسی کنم؟',
    answer:
      'بله. می‌توانید رزومه، سوابق و پیشنهادهای ارسال‌شده را مقایسه کنید و پس از اطمینان، همکاری را آغاز نمایید.',
  },
  {
    type: 2,
    question: 'چگونه به پروژه‌های حسابداری دسترسی پیدا کنم؟',
    answer:
      'پس از تکمیل رزومه و ثبت‌نام، می‌توانید پروژه‌های منتشرشده را مشاهده، فیلتر و برای آن‌ها پیشنهاد همکاری ارسال کنید.',
  },
  {
    type: 2,
    question: 'برای ارسال پیشنهاد چه اطلاعاتی لازم است؟',
    answer:
      'معمولاً شرح کوتاه تجربه مرتبط، زمان‌بندی پیشنهادی و مبلغ پیشنهادی کافی است. جزئیات بیشتر در فرم ارسال پیشنهاد نمایش داده می‌شود.',
  },
]

const projects = ref<ProjectList[]>([])
const activeProjectPage = ref(1)


const api = useApi()

async function getProjects() {
  const result = await api.get<ApiResponse>('/projects')
  projects.value = (result.data ?? []).slice(0, 6)
}
const posts = [
  {
    title: 'تکمیل اظهارنامه مالیاتی',
    excerpt:
      'جدیدترین فرصت های شغلی حسابداری را مشاهده کنید و رزومه خود را برای شرکت ها و کسب وکارهای فعال ارسال کنید.',
    color: '#B95C04',
    badgeClass: "bg-[#FFF5EB] text-warning-500",
    badgeTitle: "اظهارنامه",
    btnText: 'اظهارنامه',
    link: '/account',
  },
  {
    title: 'رزومه ساز حسابداری',
    excerpt:
      'با رزومه ساز حسابداری، رزومه حرفه ای و استاندارد خود را بسازید و برای فرصت های شغلی حسابداری اقدام کنید.',
    color: '#06C399',
    badgeClass: "bg-[#EBF0FC] text-primary-500",
    badgeTitle: "رزومه ساز",
    btnText: 'رزومه ساز',
    link: '/account',
  },
  {
    title: 'استخدام و جذب حسابدار',
    excerpt:
      'برای استخدام حسابدار و جذب نیرو، آگهی استخدام ثبت کنید و رزومه حسابداران متخصص را بررسی کنید.',
    color: '#4864E1',
    badgeClass: "bg-[#E6FAF3] text-accent-500",
    badgeTitle: "استخدام نیرو",
    btnText: 'استخدام حسابدار',
    link: '/account',
  },
];
async function toggleBookmark(id: string | number, type: string) {
  await api.post<ApiResponse>(`/bookmarks/toggle/${id}`, {
    query: { type },
  })
}


onMounted(() => {
  getProjects()
})

useSeoMeta({
  title: 'پروژه‌های حسابداری | ثبت و دریافت پروژه',
  description:
    'ثبت پروژه حسابداری، مشاهده جدیدترین پروژه‌ها و همکاری حسابداران متخصص با کسب‌وکارها در پلتفرم های‌حساب.',
})
</script>
