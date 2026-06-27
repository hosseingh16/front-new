<template>
  <div>
    <!-- Hero -->
    <section
      class="bg-[url('/images/bg-6.png')] md:bg-[url('/images/bg-6.png')] bg-no-repeat bg-top pb-8"
    >
      <div class="custom-pad flex flex-col items-center pt-16 md:pt-24">
        <m-contact-divider class="mb-6" />
        <h1 class="text-2xl text-text-tertiary font-yb-bold text-center">تماس با ما</h1>
        <p class="mt-4 text-[18px] text-text-tertiary text-center">
          لطفاً قبل از تماس با ما
          <NuxtLink to="/faq" class="text-primary-500 hover:opacity-80">سوالات متداول</NuxtLink>
          را بررسی کنید
        </p>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="custom-pad pb-12">
      <div class="max-w-2xl mx-auto bg-surface-100 rounded-lg p-6">
        <form class="space-y-4" @submit.prevent="submitForm">
          <m-text-field
            v-model="form.name"
            label="نام و نام خانوادگی شما"
            placeholder="مثال : علی محمدی"
          />
          <m-text-field
            v-model="form.cellphone"
            label="شماره تماس شما"
            placeholder="مثال : ۰۹۱۲۳۴۵۶۷۸۹"
          />
          <m-text-field
            v-model="form.text"
            label="پیام شما"
            placeholder="متن پیامتان را بنویسید"
            multiline
          />
          <button type="submit" class="btn btn-primary w-full mt-2 gap-2">
            ثبت و ارسال
            <Icon name="heroicons:arrow-up-left-solid" size="20" class="shrink-0" />
          </button>
        </form>
      </div>
    </section>

    <!-- Map -->
    <section class="bg-surface-100 py-12">
      <div class="custom-pad flex flex-col items-center">
        <h2 class="text-xl text-text-tertiary font-yb-bold text-center">
          دفتر مرکزی 'های‌حساب'
        </h2>
        <div
          class="mt-6 w-full max-w-4xl bg-white rounded-lg border border-gray-default px-4 py-3 flex items-center gap-2 text-sm justify-center"
        >
          <Icon name="lucide:locate-fixed" size="20" class="shrink-0 text-[#383838]" />
          <p>
            خراسان رضوی - هاشمیه ۶ - برج اداری آبان - طبقه چهارم - واحد ۴۰۴
          </p>
        </div>
        <div class="mt-6 w-full max-w-4xl relative rounded-lg overflow-hidden">
          <img src="/images/contact-us-map.webp" alt="دفتر مرکزی های حساب" class="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    <!-- Support Cards -->
    <section class="custom-pad py-12">
      <h2 class="text-xl text-text-tertiary font-yb-bold text-center">
        پشتیبانی آنلاین و تلفنی
      </h2>
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        <div
          v-for="item in supportItems"
          :key="item.title"
          class="bg-white border border-gray-default rounded-lg p-4 flex flex-row gap-3 justify-center"
        >
          <div class="flex items-center gap-3 flex-1">
            <div
              class="w-10 h-10 rounded-tr-3xl rounded-lg bg-[#C8F1D7] flex items-center justify-center"
            >
              <Icon :name="item.icon" size="20" class="text-[#002E28] font-light" />
            </div>
            <div class="flex flex-col justify-center">
              <p class="text-sm py-1 font-semibold text-text-tertiary">{{ item.title }}</p>
              <p class="text-sm py-1 text-text-tertiary">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const form = reactive({
  name: '',
  cellphone: '',
  text: '',
})
const api = useApi();
const { $toast } = useNuxtApp();

const supportItems = [
  {
    icon: 'tabler:phone',
    title: 'شماره تلفن پشتیبانی',
    value: '(۰۲۱) ۹۱۳۰۰۷۰۸',
  },
  {
    icon: 'tabler:clock',
    title: 'ساعات کاری پشتیبانی',
    value: 'ساعت کاری : ۲۴ ساعته',
  },
  {
    icon: 'tabler:mail',
    title: 'ایمیل پشتیبانی کاربران',
    value: 'hihesabinfo@gmail.com',
  },
  {
    icon: 'tabler:calendar',
    title: 'روز های کاری پشتیبانی',
    value: 'روز های کاری : ۷ روز هفته',
  },
]

async function submitForm() {
  const response = await api.post<any>('/contact', {
    name: form.name,
    cellphone: form.cellphone,
    text: form.text,
  }); 
  if (response.success) {
    form.name = '';
    form.cellphone = '';
    form.text = '';
    $toast.success('پیام شما با موفقیت ارسال شد');
  } else {
    $toast.error('خطا در ارسال پیام');
  }
}

useSeoMeta({
  title: 'تماس با ما',
  description:
    'با تیم پشتیبانی های‌حساب تماس بگیرید — شماره تماس، ایمیل و آدرس دفتر مرکزی',
})
</script>
