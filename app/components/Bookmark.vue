<template>
  <dialog1
    id="bookmarkModal"
    title="برای نشانک گذاری آگهی مورد نظر ابتدا وارد حساب کاربری خود شوید"
    type="warning"
    :width="512"
  >
    <div class="text-right">
      <div>
        <p class="font-semibold">ورود | ثبت نام</p>
        <p class="mt-4 text-sm text-gray-700 font-normal">شماره موبایل</p>
        <input
          placeholder="لطفا شماره موبایل خود را وارد کنید"
          class="placeholder:text-sm placeholder:text-gray-500 w-full p-2 bg-gray-100 rounded-lg focus:outline-0"
        />
        <span class="text-gray-500 text-xs font-font-regular">مثال :*** **** 0912 </span>
      </div>
      <form method="dialog">
        <button class="btn btn-primary w-full mt-8">دریافت کد تأیید</button>
      </form>
      <div class="flex justify-end gap-2 text-gray-500 text-xs font-yb-bold">
        <button class="flex gap-2 items-center">
          <Icon name="svg:key" />
          <span>ورود با رمز عبور</span>
        </button>
      </div>
    </div>
  </dialog1>
</template>
