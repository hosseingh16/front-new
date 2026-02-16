<template>
  <div class="bg-gray-soft pb-20">
    <div class="h-[310px] bg-[rgba(255,197,229,1)] flex justify-center items-center">
      <NuxtImg src="/images/company-logo.png" class="w-[102px] h-[100px]" />
    </div>
    <div class="px-4 lg:px-16 grid lg:grid-cols-3 gap-8 mt-6">
      <div class="col-span-2 p-7 bg-white rounded-4xl -mt-28 h-fit">
        <div class="max-lg:flex max-lg:justify-center">
          <NuxtImg src="/images/company-logo-2.png" class="w-[75px] h-[75px]" />
        </div>
        <div
          class="flex gap-2 max-lg:justify-center items-center mt-2 text-[rgba(47,50,65,1)]"
        >
          <p class="font-bold text-2xl">خانومی</p>
          <div class="bg-gray-300 w-[2px] h-5"></div>
          <p class="font-bold text-2xl">khanoumi</p>
        </div>
        <p class="font-semibold text-base text-gray-700 max-lg:text-center">
          کامپیوتر، فناوری اطلاعات و اینترنت
        </p>
        <p class="mt-4 text-gray-800 text-sm max-lg:text-center">
          فروشگاه اینترنتی خانومی عنوان اولین فروشگاه اینترنتی تخصصی آرایشی بهداشتی در
          ایران در سال 1393 راه اندازی شد
        </p>
        <m-tabs
          :tabs="[
            { label: 'در یک نگاه', component: Tab1 },
            { label: 'درباره خانومی', component: Tab2 },
            { label: 'فرصت‌های شغلی', component: Tab3 },
          ]"
        />
      </div>
      <div class="max-lg:hidden">
        <div class="flex flex-col justify-between relative">
          <NuxtImg src="/images/map.png" class="w-full h-full rounded-2xl" />
          <div class="absolute bottom-2 left-2 right-2 bg-white rounded-lg p-5">
            <div class="flex gap-2 items-start">
              <Icon name="svg:location-4" class="mt-1" />
              <div>
                <p class="font-bold text-gray-800">موقعیت مکانی</p>
                <p class="font-semibold text-sm text-[rgba(219,39,119,1)]">
                  دفتر مرکزی خانومی
                </p>
                <p class="text-gray-700 text-sm font-normal">
                  تهران - خیابان ولی‌عصر-ساختمان کیان، پلاک ۲۵۵۱
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 border border-gray-300 rounded-2xl p-4 text-gray-800">
          <div class="flex items-center gap-2">
            <Icon name="svg:user-tick" />
            <p class="font-semibold">اعضای بنیان‌گذار</p>
          </div>
          <div v-for="item in peoples" class="bg-white p-4 rounded-2xl mt-4">
            <div class="flex items-center gap-4">
              <div class="relative">
                <NuxtImg :src="`/images/${item.img}`" class="w-[68px] h-[68px]" />
                <div
                  class="flex justify-center items-center w-6 h-6 bg-[rgba(228,235,252,1)] rounded-full absolute top-0"
                >
                  <Icon name="svg:quote-1" />
                </div>
              </div>
              <div>
                <p class="font-bold">{{ item.name }}</p>
                <p class="text-sm font-normal">{{ item.title }}</p>
              </div>
            </div>
            <p class="mt-4 text-sm font-semibold text-gray-800">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tab1 from './components/Tab1.vue';
import Tab2 from './components/Tab2.vue';
import Tab3 from './components/Tab3.vue';

// Parameters
const peoples = [
  {
    name: 'مسعود شاه‌مرادی',
    title: 'بنیان‌گذار',
    text: '“ خانومی کسب و کار رو به رشدی است که می تواند مسیر شغلی جذاب و معناداری برای همه افرادی فراهم کند که دغدغه رشد، توسعه و اثرگذاری دارند. ما در خانومی فرصت تجربه کردن، خلق مسیرهای جدید با همراهی و برنامه ریزی دقیق به هم داستانی های جدید خود می دهیم. “',
    img: 'person-4.png',
  },
  {
    name: 'مریم یاوری',
    title: 'مدیر ارشد منابع انسانی',
    text: '“ خانومی کسب و کار رو به رشدی است که می تواند مسیر شغلی جذاب و معناداری برای همه افرادی فراهم کند که دغدغه رشد، توسعه و اثرگذاری دارند. ما در خانومی فرصت تجربه کردن، خلق مسیرهای جدید با همراهی و برنامه ریزی دقیق به هم داستانی های جدید خود می دهیم. “',
    img: 'person-5.png',
  },
];
</script>
