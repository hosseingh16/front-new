<template>
  <footer class="bg-surface-100">
    <div class="max-w-384 w-full m-auto">
      <section class="custom-pad mt-16 bg-surface-100">
        <div class="bg-primary-500 p-6 rounded-lg text-white">
          <p class="text-2xl font-yb-bold max-sm:text-center">
            اولین پلتفرم تخصصی استخدام حسابدار در ایران
          </p>
          <p class="mt-5 text-surface-50 leading-8">
            انتخاب حسابدار، به‌دلیل نقش تأثیرگذار او در ساختار مالی شرکت،
            فرایندی حساس و نیازمند دقت است.<br />های‌حساب با ارائه رزومه‌های
            تخصصی و جامعه‌ای از حسابداران حرفه‌ای، این مسیر را برای کارفرمایان
            مطمئن‌تر می‌کند.هم‌زمان، حسابداران نیز می‌توانند با رزومه استاندارد
            و فرصت‌های شغلی متنوع، مسیر رشد شغلی و افزایش درآمد خود را هموارتر
            سازند.
          </p>
        </div>
      </section>

      <!-- Desktop footer -->
      <div
        class="custom-pad bg-surface-100 pt-12 text-sm font-semibold grid md:grid-cols-6 gap-8 pb-20 max-md:hidden"
      >
        <div class="flex flex-col gap-3">
          <NuxtLink
            v-for="link in jobseekerLinks"
            :key="link.to + link.label"
            :to="link.to"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="flex flex-col gap-3">
          <NuxtLink
            v-for="link in businessLinks"
            :key="link.to + link.label"
            :to="link.to"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="flex flex-col gap-3">
          <NuxtLink
            v-for="link in aboutLinks"
            :key="link.to + link.label"
            :to="link.to"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div class="flex flex-col gap-3">
          <p>راه های ارتباطی</p>
          <p>(051)91012030</p>
          <p>(021)91300708</p>
        </div>

        <div class="flex flex-col gap-3">
          <p>شبکه های اجتماعی</p>
          <div class="flex justify-center items-center gap-1">
            <NuxtLink
              v-for="item in socials"
              :key="item"
              class="h-8 w-8 flex justify-center items-center bg-white rounded-lg"
            >
              <Icon :name="`svg:${item}`" />
            </NuxtLink>
          </div>
        </div>

        <div class="min-w-0">
          <div class="flex gap-2 w-full">
            <NuxtImg
              v-for="img in badgeImages"
              :key="img"
              :src="img"
              class="min-w-0 flex-1 h-auto object-contain"
            />
          </div>
        </div>
      </div>

      <!-- Mobile footer -->
      <div class="custom-pad bg-surface-100 pt-8 pb-16 md:hidden">
        <div class="space-y-2">
          <div
            v-for="(section, index) in mobileSections"
            :key="section.title"
            class="cursor-pointer rounded-lg bg-surface-200 px-4 py-4 text-sm text-text-tertiary"
            @click="toggleSection(index)"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <Icon name="svg:plus" size="16" />
                <p class="font-semibold">{{ section.title }}</p>
              </div>
              <icons-chevron
                color="currentColor"
                class="shrink-0 transition-transform"
                :class="expandedIndex === index ? 'rotate-180' : ''"
              />
            </div>
            <div
              class="flex flex-col gap-3 font-semibold leading-7 transition-all"
              :class="
                expandedIndex === index ? 'mt-4 h-fit' : 'h-0 overflow-hidden'
              "
            >
              <NuxtLink
                v-for="link in section.links"
                :key="link.to + link.label"
                :to="link.to"
                class="text-text-passive"
                @click.stop
              >
                {{ link.label }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="mt-10 flex flex-col items-center gap-3">
          <p class="text-sm font-semibold text-text-tertiary">
            شبکه های اجتماعی
          </p>
          <div class="flex items-center justify-center gap-2">
            <NuxtLink
              v-for="item in socials"
              :key="item"
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-white"
            >
              <Icon :name="`svg:${item}`" />
            </NuxtLink>
          </div>
        </div>

        <div class="mt-8 flex gap-2 justify-center">
          <NuxtImg
            v-for="img in badgeImages"
            :key="img"
            :src="img"
            class="h-20 w-20 rounded-xl bg-white object-contain p-2"
          />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface FooterLink {
  label: string;
  to: string;
}

const jobseekerLinks: FooterLink[] = [
  { label: "حسابدار", to: "/" },
  { label: "رزومه‌ساز", to: "/" },
  { label: "جست‌وجوی فرصت‌های‌ شغلی", to: "/ad" },
  { label: "ایجاد پروژه حسابداری", to: "/" },
  { label: "سوالات متداول", to: "/faq" },
];

const businessLinks: FooterLink[] = [
  { label: "کسب و کار", to: "/" },
  { label: "ایجاد آگهی استخدام", to: "/" },
  { label: "ایجاد پروژه حسابداری", to: "/" },
  { label: "سوالات متداول", to: "/faq" },
  { label: "اظهارنامه عملکرد", to: "/tax-return" },
  { label: "پروژه های حسابداری", to: "/projects" },
];

const aboutLinks: FooterLink[] = [
  { label: "درباره ما", to: "/" },
  { label: "سوالات متداول", to: "/faq" },
  { label: "قوانین و مقررات", to: "/terms" },
  { label: "حریم خصوصی", to: "/privacy" },
  { label: "درباره ما", to: "/" },
  { label: "تماس ما", to: "/contact" },
];

const socials = ["telegram", "linkedin", "instagram"] as const;

const badgeImages = [
  "/images/footer-img-1.png",
  "/images/footer-img-2.png",
  "/images/footer-img-3.png",
];

const mobileSections = [
  { title: "بخش کارجویان", links: jobseekerLinks },
  { title: "بخش کسب و کار", links: businessLinks },
  { title: "درباره های‌حساب", links: aboutLinks },
];

const expandedIndex = ref<number | null>(null);

function toggleSection(index: number) {
  expandedIndex.value = expandedIndex.value === index ? null : index;
}
</script>
