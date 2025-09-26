<template>
  <div class="pt-5 pb-12 px-5 md:px-[10%]">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-1">
        <m-circles :colors="['#CDE9D7', '#91CFA7', '#38A95E']" />
        <span class="text-gray-500 max-md:text-14">استخدام‌های مهم امروز</span>
      </div>
      <button
        class="px-2 btn btn-primary btn-outline text-primary-900 hover:bg-white h-10 max-md:text-14"
      >
        مشاهده همه
        <Icon name="svg:chevron-left" />
      </button>
    </div>
    <div class="grid md:grid-cols-2 hd:grid-cols-3 gap-x-6 gap-y-4 mt-4">
      <div v-for="n in 6" class="border border-gray-400 rounded-lg p-2">
        <div class="flex items-center gap-4 border-b border-gray-400 pb-4">
          <div class="border border-[#EBECF1] rounded-xl p-2">
            <NuxtImg src="/images/img-11.png" />
          </div>
          <div>
            <p class="font-semibold text-14">
              مدیر مالی
              <span class="font-normal text-gray-500 mr-1">روغن فوکوس ایرانیان</span>
            </p>
            <div class="flex items-center gap-2 mt-1">
              <Icon name="svg:location-2" />
              <span class="text-[#36B37E] text-xs">تهران</span>
              <Icon name="svg:bag" />
              <span class="text-gray-500 text-xs">تمام وقت</span>
            </div>
          </div>
        </div>
        <div class="pt-4 pb-2 flex justify-between items-center text-gray-500">
          <span class="text-xs">امروز</span>
          <button class="btn btn-outline text-xs border-gray-400 h-8 px-2">
            ارسال رزومه
          </button>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-1 mt-8">
      <m-circles :colors="['#FFDFCB', '#FFB98D', '#FF8030']" />
      <span class="text-gray-500 max-md:text-14">استخدام‌های پاره وقت</span>
    </div>
    <div class="grid md:grid-cols-2 hd:grid-cols-3 gap-x-6 gap-y-4 mt-4">
      <div v-for="n in 6" class="border border-gray-400 rounded-lg p-2">
        <div class="flex items-baseline gap-4 border-b border-gray-400 pb-4">
          <Icon name="svg:user-search-2" size="20" />
          <div>
            <p class="font-semibold text-14">
              ناظر اجرای حسابداری
              <span class="font-normal text-gray-500 mr-1">روغن فوکوس ایرانیان</span>
            </p>
            <div class="flex items-center gap-2 mt-1">
              <Icon name="svg:location-3" />
              <span class="text-[#36B37E] text-xs">تهران</span>
              <Icon name="svg:bag" />
              <span class="text-gray-500 text-xs">تمام وقت</span>
            </div>
          </div>
        </div>
        <div class="pt-4 pb-2 flex justify-between items-center text-gray-500">
          <span class="text-xs">امروز</span>
          <button class="btn btn-outline text-xs border-gray-400 h-8 px-2">
            ارسال رزومه
          </button>
        </div>
      </div>
    </div>
    <div class="text-center">
      <button
        class="hd:hidden mt-5 px-2 btn btn-primary btn-outline text-primary-900 hover:bg-white h-10 max-md:text-14"
      >
        مشاهده همه
        <Icon name="svg:chevron-left" />
      </button>
    </div>
  </div>
</template>
