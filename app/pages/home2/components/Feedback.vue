<template>
  <div>
    <m-titr class="my-8 text-center"> ما به بازخورد مشتریانمان افتخار می‌کنیم!</m-titr>
    <div class="bg-[#EBECF1] py-10 md:py-20 px-[10%]">
      <div class="flex justify-between items-center gap-10">
        <button>
          <Icon name="svg:chevron-down" class="-rotate-90" />
        </button>
        <div class="flex flex-col items-center max-[850px]:hidden">
          <NuxtImg src="/images/comment-1.png" />
          <p class="font-semibold mt-2">اوراش</p>
          <p class="text-sm text-center">یک دژ مالی مستحکم قابل اتکا</p>
        </div>
        <div
          class="w-[480px] flex flex-col md:flex-row gap-3 md:gap-5 max-[850px]:hidden relative"
        >
          <Icon
            name="svg:quote-3"
            size="100"
            class="absolute -top-10 left-0 opacity-10"
          />
          <Icon name="svg:quote-1" class="md:w-20" />
          <p class="max-md:text-center">
            ما دنبال یه حسابدار دقیق و با‌تجربه بودیم.تو این سایت خیلی راحت آگهی گذاشتیم.
            رزومه‌هایی که دریافت کردیم دقیق و فیلترشده بودن.مصاحبه کردیم و سریع به نتیجه
            رسیدیم.<br />کلاً تجربه‌ی استخداممون خیلی بهتر از قبل بود.
          </p>
        </div>
        <div class="min-[850px]:hidden flex flex-col items-center relative">
          <Icon
            name="svg:quote-3"
            size="100"
            class="absolute bottom-10 left-10 opacity-10"
          />
          <NuxtImg src="/images/comment-1.png" />
          <p class="font-semibold mt-2">اوراش</p>
          <p class="text-sm text-center">یک دژ مالی مستحکم قابل اتکا</p>
          <div class="flex flex-col md:gap-5">
            <Icon name="svg:quote-1" />
            <p class="max-md:text-center">
              ما دنبال یه حسابدار دقیق و با‌تجربه بودیم.تو این سایت خیلی راحت آگهی
              گذاشتیم. رزومه‌هایی که دریافت کردیم دقیق و فیلترشده بودن.مصاحبه کردیم و سریع
              به نتیجه رسیدیم.<br />کلاً تجربه‌ی استخداممون خیلی بهتر از قبل بود.
            </p>
            <Icon name="svg:quote-2" class="self-end-safe" />
          </div>
        </div>
        <button>
          <Icon name="svg:chevron-down" class="rotate-90" />
        </button>
      </div>
    </div>
  </div>
</template>
