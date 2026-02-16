<template>
  <div
    class="py-5 px-5 min-1130:px-20 shadow-[0_5px_18px_0_rgba(0,0,0,0.07)] flex justify-between items-center text-sm"
  >
    <div class="flex min-1130:gap-7 items-center text-sm">
      <button class="min-1130:hidden">
        <Icon name="svg:menu" class="mt-4" />
      </button>
      <NuxtImg src="/images/logo.png" />
      <div class="max-1130:hidden">
        <NuxtLink>
          <button class="btn btn-ghost text-sm">خانه</button>
        </NuxtLink>
        <div class="dropdown dropdown-hover">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost flex items-center gap-4 text-sm"
          >
            <span>فرصت‌های شغلی</span>
            <Icon name="svg:chevron-down" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li><a>فرصت1</a></li>
            <li><a>فرصت2</a></li>
          </ul>
        </div>
        <!-- <div class="dropdown dropdown-hover">
          <div
            tabindex="0"
            role="button"
            class="btn btn-ghost flex items-center gap-4 text-sm"
          >
            <span>خدمات</span>
            <Icon name="svg:chevron-down" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li><a>خدمت1</a></li>
            <li><a>خدمت2</a></li>
          </ul>
        </div> -->
        <NuxtLink>
          <button class="btn btn-ghost text-sm">رزومه‌ساز</button>
        </NuxtLink>
        <NuxtLink>
          <button class="btn btn-ghost text-sm">
            <Icon name="svg:award-2" />
            مشاورین ما
          </button>
        </NuxtLink>
        <NuxtLink>
          <button class="btn btn-ghost text-sm">وبلاگ</button>
        </NuxtLink>
        <NuxtLink>
          <button class="btn btn-ghost text-sm">درباره ما</button>
        </NuxtLink>
      </div>
    </div>
    <button class="btn bg-gray-800 text-gray-100 text-sm h-9">
      <Icon name="svg:user" />
      ورود | ثبت‌نام
    </button>
    <!-- <div class="flex items-center">
      <button
        class="max-1130:btn max-1130:btn-outline max-1130:border-gray-300 max-1130:text-sm max-1130:h-9"
      >
        بخش کارفرمایان
      </button>
      <div class="divider divider-horizontal mx-1 min-1130:mx-3"></div>
      <button class="px-3 btn btn-primary min-1130:btn-outline min-1130:text-black min-1130:border-gray-300 text-sm h-9">
        ورود و ثبت‌نام کارجو
      </button>
    </div> -->
  </div>
</template>
