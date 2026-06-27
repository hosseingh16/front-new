<template>
  <div class="bg-surface-50">
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-5.png')] bg-no-repeat bg-top md:bg-position-[center_-150px] pb-10"
    >
    <div class="custom-pad pt-6">
      <nav class="text-sm text-text-passive">
        <NuxtLink to="/" class="hover:text-primary-500 transition-colors">
          <Icon name="svg:home" size="16" />
        </NuxtLink>
        <span class="mx-2">/</span>
        <span>خدمات</span>
        <span class="mx-2">/</span>
        <span class="text-text-tertiary">فرصت های شغلی</span>
      </nav>
    </div>
      <div class="custom-pad flex flex-col items-center gap-4 pt-8 md:pt-12">
        <div
          class="text-primary-500 font-semibold text-sm flex justify-center items-center p-2 bg-[#4864E114] rounded-xl"
        >
          فرصت‌های شغلی حسابداری را پیدا کنید
        </div>
        <h1 class="font-yb-bold text-[23px] lg:text-h1 text-center">
          مشاهده جدیدترین آگهی‌های استخدام حسابداری
        </h1>
        <h2 class="text-center">
          از بین فرصت‌های شغلی تمام‌وقت، نیمه‌وقت و پروژه‌ای، موقعیت مناسب خود را پیدا
          کرده و رزومه خود را برای سازمان‌های معتبر ارسال کنید.
        </h2>
      </div>
    </section>

    <div class="custom-pad grid md:grid-cols-7 gap-4 items-start">
      <div
        class="md:col-span-2 bg-white rounded-lg border border-b-0 border-gray-default text-text-tertiary text-sm"
      >
        <div class="join join-vertical w-full">
          <filter-collapse v-for="(item, index) in filters" :expand="index === 0">
            <template #title
              ><Icon :name="`svg:${item.icon}`" /> {{ item.title }}</template
            >
            <template #content>
              <div v-if="index === 0" class="space-y-2">
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="true"
                    class="checkbox checkbox-primary p-1.5"
                  />
                  <Icon name="svg:bag-3" />
                  <span>تمام وقت</span>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="true"
                    class="checkbox checkbox-primary p-1.5"
                  />
                  <Icon name="svg:bag-3" />
                  <span>پاره وقت</span>
                </div>
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="true"
                    class="checkbox checkbox-primary p-1.5"
                  />
                  <Icon name="svg:bag-3" />
                  <span>پروژه</span>
                </div>
              </div>
            </template>
          </filter-collapse>
        </div>
      </div>

      <div class="md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="n in 8" class="bg-white p-1 rounded-lg">
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
    </div>
    
    <Questions
      title="سوالی دارید؟ ما پاسخگو هستیم "
      subtitle="برای یافتن پاسخ، می‌توانید از دسته‌بندی‌های زیر استفاده کنید"
    />
  </div>
</template>

<script setup lang="ts">
import FilterCollapse from '~/features/home/FilterCollapse.vue';
import Questions from '~/features/home/Questions.vue';

const filters = [
  { title: 'نوع آگهی', icon: 'user-search-4' },
  { title: 'جستجو عنوان', icon: 'search-1' },
  { title: 'گروه‌های شغلی', icon: 'bag-4' },
  { title: 'شهر', icon: 'location-6' },
  { title: 'حقوق', icon: 'wallet' },
  { title: 'سابقه کار', icon: 'work-history-2' },
  { title: 'نوع قرارداد', icon: 'text' },
  { title: 'مزایای سازمانی', icon: 'benefits' },
];

</script>
