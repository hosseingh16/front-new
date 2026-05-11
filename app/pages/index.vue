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
        <div class="flex gap-2 mt-5">
          <button class="btn btn-success">
            <Icon name="svg:user-plus-white" size="24" />
            استخدام حسابدار
          </button>
          <button class="btn btn-primary">
            <Icon name="svg:user-plus-white" size="24" />
            استخدام مشاور
          </button>
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
        <div
          class="flex gap-1 bg-surface-100 p-1 rounded-xl [&>.btn]:text-sm [&>.btn]:h-8"
        >
          <button
            v-for="(item, index) in ['همه', 'تمام وقت', 'پاره وقت', 'پروژه']"
            class="btn btn-ghost"
            :class="
              jobType === index
                ? 'bg-white text-text-primay'
                : 'bg-surface-100 text-text-passive'
            "
            @click="jobType = index"
          >
            {{ item }}
          </button>
        </div>
        <button class="btn btn-outline text-primary-500 max-sm:hidden">
          مشاهده همه
          <icons-arrow color="#4864e1" :size="15" class="mr-1" />
        </button>
      </div>
      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="n in 9" class="bg-white p-1 rounded-lg">
          <div class="bg-[#F6F8FE] rounded-lg p-3">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center bg-[#ECF4D9] rounded-2xl">
                  <img src="/images/img-14.png" alt="" />
                </div>
                <div class="text-sm">
                  <p class="font-semibold">استخدام حسابدار</p>
                  <div class="flex flex-wrap items-center mt-2">
                    <Icon name="svg:buildings-4" />
                    <p class="text-text-passive">نام شرکت:</p>
                    <p class="mr-1">بازرگانی سپهر</p>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <Icon name="svg:bookmark" />
                <p class="text-xs text-text-passive">3 روز قبل</p>
              </div>
            </div>
            <div class="flex gap-1 text-sm mt-3 overflow-x-auto no-scrollbar">
              <div
                class="shrink-0 border border-gray-default rounded-full bg-white py-1 px-3"
              >
                فروش آهن‌آلات
              </div>
              <div
                class="shrink-0 border border-gray-default rounded-full bg-white py-1 px-3"
              >
                مشهد، وکیل آباد
              </div>
              <div
                class="shrink-0 border border-gray-default rounded-full bg-white py-1 px-3"
              >
                خانم
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-2 px-2">
            <div>
              <p class="text-sm text-text-secondary">تمام وقت</p>
              <p class="font-semibold">20 تا 25 میلیون تومان</p>
            </div>
            <button
              class="btn border-none px-2 h-8 text-sm text-primary-500 bg-[#4864E114]"
            >
              <icons-chevron class="rotate-90" color="#4864e1" />
              مشاهده
            </button>
          </div>
        </div>
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

    <!-- [START] Customers -->
    <section
      class="bg-surface-100 flex flex-col min-[1220px]:flex-row justify-center min-[1220px]:justify-between items-center gap-6 min-[1220px]:gap-2 py-12 leading-10"
    >
      <p class="px-5 min-[1220px]:pr-37.5 font-semibold">
        های‌حساب ، مورد اعتماد بهترین سازمان‌ها<br />همراه شما در جذب حرفه ای ترین نیروها
      </p>
      <div
        class="pr-5 min-[1220px]:pl-37.5 flex gap-12 overflow-x-auto no-scrollbar max-[450px]:w-full"
      >
        <div v-for="item in banks" class="flex flex-col shrink-0 items-center leading-4">
          <img :src="`/images/${item.image}`" alt="" class="w-12 h-12" />
          <span class="font-semibold text-[10px] mt-4">{{ item.title }}</span>
          <span class="font-semibold text-[10px] text-gray-600">{{ item.subtitle }}</span>
        </div>
      </div>
    </section>
    <!-- [END] Customers -->

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
    <section class="custom-pad mt-12">
      <p class="text-2xl text-text-tertiary font-yb-bold text-center">
        پاسخ به رایج‌ترین سوالات درباره خدمات های‌حساب
      </p>
      <p class="mt-4 text-[18px] text-text-tertiary font-semibold text-center">
        نظرات کارفرمایان و حسابدارانی که بابرای یافتن پاسخ، می‌توانید از دسته‌بندی‌های زیر
        استفاده کنید
      </p>
      <div
        class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 [&>.btn]:h-8 [&>.btn]:text-sm"
      >
        <button
          v-for="n in 4"
          class="btn"
          :class="
            questionType === n
              ? 'btn-primary'
              : 'btn-outline border-primary-200 text-primary-500'
          "
          @click="questionType = n"
        >
          <span v-if="n === 1">عمومی</span>
          <span v-else-if="n === 2">استخدام حسابدار</span>
          <span v-else-if="n === 3">رزومه ساز</span>
          <span v-else>مشاور</span>
        </button>
      </div>

      <div class="space-y-2 mt-5">
        <div
          v-for="(item, index) in questions.filter((x) => x.type === questionType)"
          class="bg-surface-200 px-3 py-4 rounded-lg cursor-pointer text-sm"
          @click="toggleQuestion(index)"
        >
          <div class="flex justify-between items-center">
            <div class="flex gap-4 items-center">
              <Icon name="svg:plus" size="16" />
              <p>{{ item.title }}</p>
            </div>
            <icons-chevron
              color="black"
              class="transition-all"
              :class="expandedItem === index ? 'rotate-180' : ''"
            />
          </div>
          <div
            class="leading-6 transition-all"
            :class="expandedItem === index ? 'pt-4 h-fit' : 'h-0 overflow-hidden'"
          >
            {{ item.answer }}
          </div>
        </div>
      </div>
    </section>
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
          class="rounded-lg bg-primary-900 text-white p-6 flex flex-col justify-between"
        >
          <div>
            <p class="font-semibold text-sm">
              هوش مصنوعی در حسابداری: انقلابی در شیوه‌های مالی و حسابداری
            </p>
            <p class="mt-3 text-caption text-text-muted">
              از آنجا که هوش مصنوعی در حسابداری تنها یک واژه مدرن نیست، شما می‌توانید ...
            </p>
          </div>
          <div class="mt-3">
            <NuxtImg src="/images/img-15.png" alt="" class="w-full" />
            <div class="text-left mt-2">
              <button class="btn btn-success text-text-secondary h-8 px-6">
                ادامه مطلب
                <icons-arrow color="#121212" :size="16" class="mr-1 rotate-45" />
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-col justify-between">
          <div class="bg-white rounded-lg p-6 flex gap-4">
            <NuxtImg src="/images/img-16.png" alt="" />
            <div class="flex flex-col justify-between">
              <div>
                <p class="text-sm font-semibold text-text-primay">
                  اصول مدیریت مالی | تکنیک‌های کلیدی برای موفقیت مالی
                </p>
                <p class="mt-4 text-caption text-text-passive line-clamp-2">
                  اگرچه عده‌ای از افراد اصول مدیریت مالی را تنها یک مفهوم تئوریک یا ...
                </p>
              </div>
              <div class="text-left mt-2">
                <button class="btn btn-success text-text-secondary h-8 px-6">
                  ادامه مطلب
                  <icons-arrow color="#121212" :size="16" class="mr-1 rotate-45" />
                </button>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-6 flex gap-4">
            <NuxtImg src="/images/img-16.png" alt="" />
            <div class="flex flex-col justify-between">
              <div>
                <p class="text-sm font-semibold text-text-primay">
                  اصول مدیریت مالی | تکنیک‌های کلیدی برای موفقیت مالی
                </p>
                <p class="mt-4 text-caption text-text-passive line-clamp-2">
                  اگرچه عده‌ای از افراد اصول مدیریت مالی را تنها یک مفهوم تئوریک یا ...
                </p>
              </div>
              <div class="text-left mt-2">
                <button class="btn btn-success text-text-secondary h-8 px-6">
                  ادامه مطلب
                  <icons-arrow color="#121212" :size="16" class="mr-1 rotate-45" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="custom-pad mt-16 bg-surface-100">
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
// Variables
const keyword = ref('');
const jobType = ref(0);
const banks = [
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank1.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank2.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank3.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank4.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank5.png' },
  { title: 'بانک سامان', subtitle: '5 فرصت شغلی', image: 'bank6.png' },
];
const questionType = ref(1);
const questions = [
  {
    type: 1,
    title: 'های‌حساب چیست ؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'چگونه می‌توانم به آگهی های شغلی مناسب دسترسی پیدا کنم ؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'آیا می‌توانم رزومه خود را برای چندین آگهی مختلف ارسال کنم ؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'چگونه می توانم وضعیت رزومه های ارسال شده را پیگیری کنم ؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'آیا ارسال رزومه به چندین کارفرما تأثیر مثبتی دارد؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
  {
    type: 1,
    title: 'چگونه می‌توانم رزومه‌ام را برای هر آگهی سفارشی کنم؟',
    answer:
      'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز',
  },
];
const expandedItem = ref<number | null>(null);
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
function toggleQuestion(index: number) {
  if (expandedItem.value === index) expandedItem.value = null;
  else expandedItem.value = index;
}
</script>
