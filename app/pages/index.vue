<template>
  <div class="bg-surface-50">
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-5.png')] bg-no-repeat bg-top md:bg-position-[center_-150px]"
    >
      <div class="custom-pad flex flex-col items-center gap-4">
        <div
          class="text-primary-500 font-semibold text-sm flex justify-center items-center p-2 bg-[#4864E114] rounded-xl mt-12 md:mt-28"
        >
          استخدام سریع و مطمئن
        </div>
        <h1 class="font-yb-bold text-[23px] lg:text-h1 text-center">
          های‌حساب؛ سایت استخدام حسابدار و مرجع فرصت‌های شغلی حسابداری
        </h1>
        <h2 class="font-semibold text-lg text-center">
          پلی میان کارفرمایان و حسابداران برای استخدام و همکاری حرفه‌ای
        </h2>
        <div class="flex flex-wrap gap-2 mt-5">
          <button class="btn btn-success">
            <Icon name="svg:user-plus-white" size="24" />
            استخدام حسابدار
          </button>
          <NuxtLink to="/opportunities-jobs">
            <button class="btn btn-primary">
            <Icon name="svg:user-plus-white" size="24" />
            مشاهده فرصت های شغلی
          </button>
          </NuxtLink>
        </div>
        <div
          class="mt-6 p-2 border-4 border-surface-100 bg-white rounded-lg w-full h-16 flex items-center"
        >
          <icons-search-2 color="#D1D1D1" />
          <input
            v-model="keyword"
            class="mr-1 grow py-3 focus:outline-none placeholder:text-text-muted"
            placeholder="جستجوی عنوان‌ شغلی، نام کارجو، مشاور، سازمان یا نوع فعالیت ..."
          />
          <button
            class="btn max-md:hidden"
            :class="{ 'btn-disabled': keyword === '', 'btn-primary': keyword !== '' }"
          >
            <icons-search-2 color="#D1D1D1" />
            جستجو
          </button>
        </div>
      </div>
    </section>

    <!-- [START] Jobs -->
    <section class="custom-pad mt-28">
      <div class="flex items-center gap-2">
        <Icon name="svg:bag-1" size="24" />
        <p class="text-text-tertiary font-semibold text-xl">
          جدیدترین فرصت‌های شغلی حسابداری ثبت شده
        </p>
      </div>
      <div class="mt-6 flex items-center justify-between">
        <m-toggle
          v-model="jobType"
          :items="[
            { title: 'همه', value: 'همه' },
            { title: 'تمام وقت', value: 'تمام وقت' },
            { title: 'پاره وقت', value: 'پاره وقت' },
            { title: 'پروژه', value: 'پروژه' },
          ]"
        />
        <button
          class="btn btn-outline text-primary-500 max-sm:hidden"
          @click="navigateTo('/jobs')"
        >
          مشاهده همه
          <icons-arrow color="#4864e1" :size="15" class="mr-1" />
        </button>
      </div>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <template v-if="jobType === 'پروژه'">
          <ItemBox
            v-for="project in projects"
            :key="project.id"
            variant="project"
            :item="project"
            @bookmark="toggleBookmark"
          />
        </template>
        <template v-else>
          <ItemBox
            v-for="ad in ads"
            :key="ad.id"
            variant="ad"
            :item="ad"
            @bookmark="toggleBookmark"
          />
        </template>
        <button class="btn btn-outline text-primary-500 sm:hidden">
          مشاهده همه
          <icons-arrow color="#4864e1" :size="15" class="mr-1" />
        </button>
      </div>
    </section>
    <!-- [END] Jobs -->

    <m-divider class="mt-16" />

    <!-- [START] Services -->
    <section
      class="custom-pad mt-16 bg-[url('/images/bg-8.png')] lg:bg-[url('/images/bg-7.png')] bg-no-repeat bg-cover max-lg:pb-6 py-20"
    >
      <div class="grid lg:grid-cols-5 gap-12 items-center">
        <div class="lg:col-span-2 text-white flex flex-col items-center lg:items-start">
          <div
            class="text-[#002E28] font-semibold text-sm flex justify-center items-center p-2 bg-[#67EEC7] rounded-xl"
          >
            خدمات های‌حساب
          </div>
          <p class="font-yb-bold text-2xl mt-5 leading-10 max-lg:text-center">
            های‌حساب چه خدماتی برای استخدام حسابدار و همکاری مالی ارائه می‌دهد؟
          </p>
          <p
            class="text-base lg:text-[18px] font-semibold mt-6 leading-10 max-lg:text-center"
          >
            استخدام حسابدار، پیدا کردن فرصت‌های شغلی و دریافت مشاوره تخصصی؛ هر کاری که در
            مسیر شغلی و کاری‌ات داری، از همین‌جا شروع می‌شود.
          </p>
        </div>
        <div class="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(item, index) in services"
            class="p-6 bg-white rounded-lg flex flex-col items-start"
          >
            <div
              class="font-semibold text-sm flex justify-center items-center py-1 px-4 rounded-lg"
              :class="{
                'bg-[#0098E714] text-info-500': index === 0,
                'bg-[#06C39914] text-accent-500': index === 1,
                'bg-[#B95C0414] text-warning-500': index === 2,
                'bg-[#4864E114] text-primary-500': index === 3,
              }"
            >
              {{ item.title1 }}
            </div>
            <p class="mt-2 font-yb-bold text-[18px]">
              {{ item.title2 }}
            </p>
            <p class="mt-4 text-sm">
              {{ item.text }}
            </p>
            <button class="btn btn-ghost-primary mt-6 w-full text-sm">
              <Icon name="svg:open-link" />
              {{ item.btnText }}
            </button>
          </div>
        </div>
      </div>
    </section>
    <!-- [END] Services -->

    <TrustBar />

    <!-- [START] Comments -->
    <section class="px-5 1000:px-37.5 flex flex-col items-center">
      <div
        class="text-primary-500 font-semibold text-sm flex justify-center items-center py-2 px-4 bg-[#4864E114] rounded-xl mt-20"
      >
        تجربه کاربران ما
      </div>
      <p class="mt-6 text-2xl text-text-tertiary font-yb-bold text-center">
        آنچه کاربران درباره های‌حساب می‌گویند
      </p>
      <p class="mt-4 text-[18px] text-text-tertiary font-semibold text-center">
        نظرات کارفرمایان و حسابدارانی که با های‌حساب همکاری داشته‌اند
      </p>
      <div
        class="mt-8 flex gap-4 max-[1000px]:overflow-x-auto max-[1000px]:w-full no-scrollbar p-2"
      >
        <div v-for="n in 3" class="shrink-0 w-[80%] 600:w-1/2 1000:w-1/3 relative mt-5">
          <div
            class="h-10 w-10 rounded-full bg-linear-to-b from-[#67EEC7] to-primary-500 text-white font-yb-bold text-[22px] flex justify-center items-center absolute -top-5 left-1/2 -translate-x-1/2"
          >
            {{ n }}
          </div>
          <div
            class="rounded-3xl rounded-br-none p-10 shadow-[0px_0px_10px_0px_#00000024]"
          >
            <p class="text-caption text-text-tertiary text-center mb-12">
              «فرآیند ثبت پروژه و دسترسی به نیروهای متخصص برای ما بسیار ساده و سریع بود.
              این پلتفرم کمک کرد در زمان کوتاه‌تری نیروی مناسب تیم مالی‌مان را پیدا کنیم.»
            </p>
          </div>
          <div class="-mt-15 flex flex-col items-center">
            <div
              class="p-2 rounded-full w-32 h-32 bg-surface-50 shadow-[0px_4px_10px_0px_#0000001A]"
            >
              <div
                class="p-4 rounded-full w-full h-full border-2 border-primary-500 border-dashed"
              >
                <div
                  class="rounded-full w-full h-full bg-linear-to-b from-50% to-100% flex justify-center items-center"
                  :class="{
                    'from-[#FFE68C] to-[#FFF5CC] p-0': n === 1,
                    'from-[#AFAAD4] to-[#FFFFFF] p-2 ': n === 2,
                    'from-[#82E8F2] to-[#FFFFFF] p-2 ': n === 3,
                  }"
                >
                  <img v-if="n === 1" src="/images/bank3.png" alt="" />
                  <img v-if="n === 2" src="/images/bank1.png" alt="" class="w-[80%]" />
                  <img v-if="n === 3" src="/images/bank2.png" alt="" />
                </div>
              </div>
            </div>
            <div class="text-center mt-5 w-full">
              <p class="font-semibold text-sm">فرزاد فرحزاد</p>
              <p class="text-caption text-primary-500 mt-2 w-full">
                مدیر منابع انسانی موسسه کاسپین
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- [END] Comments -->

    <m-divider class="mt-12" />

    <!-- [START] Questions -->
    <Questions />
    <!-- [END] Questions -->

    <m-divider class="mt-12" />

    <section class="custom-pad mt-8 max-lg:hidden">
      <p class="text-2xl text-text-tertiary font-yb-bold text-center">
        مقالات آموزشی و تخصصی حسابداری های‌حساب
      </p>
      <p class="mt-3 text-text-tertiary font-semibold text-center">
        آموزشی -خبری - مسیرشغلی
      </p>
      <div class="mt-4 grid grid-cols-2 gap-4">
        <div
          v-if="posts[0]"
          class="rounded-lg bg-primary-900 text-white p-6 flex flex-col justify-between"
        >
          <div>
            <p class="font-semibold text-sm">
              {{ posts[0].title }}
            </p>
            <p class="mt-3 text-caption text-text-muted" v-html="posts[0].excerpt"></p>
          </div>
          <div class="mt-3">
            <NuxtImg :src="posts[0].image" :alt="posts[0].alt_text" class="w-full" />
            <div class="text-left mt-2">
              <NuxtLink :to="posts[0].link" target="_blank">
                <button class="btn btn-success text-text-secondary h-8 px-6">
                  ادامه مطلب
                  <icons-arrow color="#121212" :size="16" class="mr-1 rotate-45" />
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between">
          <div
            v-for="(post, i) in posts.slice(1, 3)"
            :key="i"
            class="bg-white rounded-lg p-6 flex gap-4 mb-4 last:mb-0"
          >
            <NuxtImg
              :src="post.image || '/images/img-16.png'"
              class="max-w-35 aspect-2/1"
              :alt="post.alt_text || ''"
            />
            <div class="flex flex-col justify-between">
              <div>
                <p class="text-sm font-semibold text-text-primay">
                  {{ post.title }}
                </p>
                <p
                  class="mt-4 text-caption text-text-passive line-clamp-2"
                  v-html="post.excerpt"
                ></p>
              </div>
              <div class="text-left mt-2">
                <NuxtLink :to="post.link" target="_blank" v-if="post.link">
                  <button class="btn btn-success text-text-secondary h-8 px-6">
                    ادامه مطلب
                    <icons-arrow color="#121212" :size="16" class="mr-1 rotate-45" />
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ItemBox from '~/components/Elements/item-box.vue';
import Questions from '~/features/home/Questions.vue';
import TrustBar from './employers/components/TrustBar.vue';
import type { AdList } from '~/types';
import type { ApiResponse } from '~/types/api';
import type { InitData } from '~/types/init';
import type { ProjectList } from '~/types/project';

// Variables
const keyword = ref('');
const ads = ref<AdList[]>([]);
const projects = ref<ProjectList[]>([]);
const posts = ref<any[]>([]);
const jobType = ref('همه');
const services = [
  {
    title1: 'استخدام',
    title2: 'فرصت های شغلی حسابداری',
    text: 'با ثبت رزومه و مشاهده پروژه‌ها، شانس خودت برای پیدا کردن کار افزایش بده.',
    btnText: 'فرصت های شغلی',
  },
  {
    title1: 'مشاورجو',
    title2: 'مشاور کسب و کار',
    text: 'با ثبت رزومه و مشاهده پروژه‌ها، شانس خودت برای پیدا کردن کار افزایش بده.',
    btnText: 'دریافت مشاوره',
  },
  {
    title1: 'پروژه',
    title2: 'ایجاد پروژه',
    text: 'با ثبت رزومه و مشاهده پروژه‌ها، شانس خودت برای پیدا کردن کار افزایش بده.',
    btnText: 'ایجاد پروژه',
  },
  {
    title1: 'استخدام نیرو',
    title2: 'استخدام حسابدار',
    text: 'با ثبت رزومه و مشاهده پروژه‌ها، شانس خودت برای پیدا کردن کار افزایش بده.',
    btnText: 'استخدام حسابدار',
  },
];

// Functions
const api = useApi();
const getPosts = async () => {
  const result = await api.get<ApiResponse>('/posts');
  posts.value = result.data;
};
const toggleBookmark = async (id: string | number, type: string) => {
  const result = await api.post<ApiResponse>('/bookmarks/toggle/' + id, {
    query: {
      type: type,
    },
  });
};
const getAds = async (jobType: string) => {
  if (jobType == 'پروژه') {
    const result = await api.get<ApiResponse>('/projects');
    console.log(1, result);
    projects.value = result.data;
  } else {
    const result = await api.get<ApiResponse>('/ads', {
      query: {
        employment_type: jobType == 'همه' ? undefined : jobType,
      },
    });
    ads.value = result.data;
  }
};
onMounted(() => {
  getAds(jobType.value);
  getPosts();
  const init = useState<InitData>('init');

  init.value?.lookup_data?.salary_ranges?.forEach((item: any) => {
    console.log(item);
  });
});
watch(jobType, () => {
  getAds(jobType.value);
});

useSeoMeta({
  title: 'سایت استخدام حسابدار و خدمات حسابداری',
  description:
    'فرصت های شغلی حسابداری، ثبت آگهی استخدام، پروژه های مالی و خدمات اظهارنامه مالیاتی برای کسب وکارها و حسابداران.',
});
</script>
