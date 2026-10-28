<template>
  <div class="overflow-x-clip bg-surface-50 text-text-tertiary">
    <!-- Hero + problem. Desktop positions match the 1536px Figma frame
         (header is outside this page, so frame Y is shifted up by 72px). -->
    <section class="relative">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-black 2xl:h-[795px]"
        :style="heroStyle"
      />

      <div class="relative mx-auto w-full 2xl:h-[1104px] 2xl:max-w-[1536px]">
        <!-- Below 1536: stacked -->
        <div
          class="relative flex flex-col gap-10 px-5 pb-8 pt-10 sm:px-8 2xl:hidden"
        >
          <div class="flex flex-col items-start text-white">
            <span
              class="inline-flex h-8 items-center rounded-lg bg-accent-300 px-2 text-[13px] font-semibold text-accent-500"
            >
              رزومه‌ساز تخصصی برای حسابداران
            </span>
            <h1
              class="mt-[18px] font-yb-bold text-[28px] leading-[1.7] sm:text-[36px] sm:leading-[61px]"
            >
              رزومه حسابداری بساز؛
              <br />
              تخصصت را دقیق به کارفرما نشان بده
            </h1>
            <p
              class="mt-4 max-w-[620px] text-[16px] font-semibold leading-[31px] sm:text-[18px]"
            >
              مهارت‌ها، نرم‌افزارها و تجربه حسابداری‌ات را در یک رزومه تخصصی ثبت
              کن و شانس دیده‌شدنت توسط کارفرما را بیشتر کن.
            </p>
            <div class="mt-8 flex flex-wrap gap-[9px]">
              <IntentLink
                to="/dashboard/cv"
                role="job_seeker"
                class="btn btn-success h-10 w-[179px] px-4"
              >
                رایگان رزومه بساز
              </IntentLink>
              <IntentLink
                to="/dashboard/my-resume"
                role="job_seeker"
                class="btn h-10 w-[179px] border border-[#e8e8e8] bg-transparent px-4 text-accent-500 hover:bg-white/10"
              >
                نمونه رزومه ببینم
              </IntentLink>
            </div>
          </div>
          <img
            :src="heroIllustration"
            alt="نمونه رزومه حسابداری ساخته‌شده در های‌حساب"
            class="mx-auto w-full max-w-[548px]"
          />
        </div>

        <div
          class="relative z-10 mx-5 rounded-t-[20px] bg-white px-5 pb-6 pt-6 sm:mx-8 2xl:absolute 2xl:left-[201px] 2xl:top-[677px] 2xl:mx-0 2xl:h-[373px] 2xl:w-[1129px] 2xl:px-0 2xl:pb-0 2xl:pt-[55px]"
        >
          <div class="mx-auto w-full max-w-[764px] text-center">
            <h2
              class="font-yb-bold text-[20px] leading-[47px] text-text-primary sm:text-[28px]"
            >
              رزومه‌های عمومی همه توانایی‌های یک حسابدار را نشان نمی‌دهند
            </h2>
            <p
              class="mt-2 text-[16px] font-semibold leading-[31px] text-text-tertiary sm:text-[18px] xl:mt-[8px]"
            >
              برای یک موقعیت حسابداری، فقط عنوان شغلی و سابقه کار کافی نیست.
              کارفرما می‌خواهد بداند با چه نرم‌افزارهایی کار کرده‌ای، در چه
              حوزه‌هایی تجربه داری و سطح مهارتت در هر بخش چقدر است.
            </p>
          </div>

          <div
            class="absolute left-[960px] top-[-69px] hidden h-[144px] w-[151px] rounded-[29px] bg-[linear-gradient(180deg,#171a46_0%,#05060f_60%,#000_100%)] 2xl:block"
          >
            <img
              :src="pdfBadge"
              alt=""
              class="absolute left-[42px] top-[22px] h-[94px] w-[88px]"
            />
          </div>
        </div>

        <img
          :src="heroIllustration"
          alt=""
          class="pointer-events-none absolute left-[201px] top-[77px] z-[1] hidden h-[836px] w-[548px] max-w-none 2xl:block"
        />

        <div
          class="absolute left-[762px] top-[105px] z-20 hidden w-[620px] flex-col items-end pt-2 text-white 2xl:flex"
        >
          <span
            class="inline-flex h-8 items-center rounded-lg bg-accent-300 px-2 text-[13px] font-semibold text-accent-500"
          >
            رزومه‌ساز تخصصی برای حسابداران
          </span>
          <h1
            class="mt-[16px] w-[550px] text-right font-yb-bold text-[36px] leading-[61px]"
          >
            رزومه حسابداری بساز؛
            <br />
            تخصصت را دقیق به کارفرما نشان بده
          </h1>
          <p
            class="mt-[16px] w-full text-right text-[18px] font-semibold leading-[31px]"
          >
            مهارت‌ها، نرم‌افزارها و تجربه حسابداری‌ات را در یک رزومه تخصصی ثبت
            کن و شانس دیده‌شدنت توسط کارفرما را بیشتر کن.
          </p>
        </div>

        <div
          class="absolute left-[1015px] top-[404px] z-20 hidden w-[367px] items-center justify-between 2xl:flex"
        >
          <IntentLink
            to="/dashboard/cv"
            role="job_seeker"
            class="btn btn-success h-10 w-[179px] px-4"
          >
            رایگان رزومه بساز
          </IntentLink>
          <IntentLink
            to="/dashboard/my-resume"
            role="job_seeker"
            class="btn h-10 w-[179px] border border-[#e8e8e8] bg-transparent px-4 text-accent-500 hover:bg-white/10"
          >
            نمونه رزومه ببینم
          </IntentLink>
        </div>

        <div
          class="relative z-20 mx-5 mt-4 grid gap-4 sm:mx-8 lg:grid-cols-3 lg:gap-[17px] 2xl:absolute 2xl:left-[200px] 2xl:top-[895px] 2xl:mx-0 2xl:mt-0 2xl:w-[1129px] 2xl:grid-cols-3"
        >
          <img
            :src="squiggleWarning"
            alt=""
            class="pointer-events-none absolute left-[346px] top-[18px] z-10 hidden h-[56px] w-[52px] 2xl:block"
          />
          <img
            :src="squiggle"
            alt=""
            class="pointer-events-none absolute left-[728px] top-[18px] z-10 hidden h-[56px] w-[52px] 2xl:block"
          />
          <article
            v-for="card in problemCards"
            :key="card.title"
            class="flex h-auto flex-col rounded-[22px] border px-4 pb-[13px] pt-4 2xl:h-[209px] 2xl:w-[365px] 2xl:px-4 2xl:pb-0 2xl:pt-4"
            :class="card.shellClass"
          >
            <h3
              class="text-center font-yb-bold text-[16px] leading-[27px]"
              :class="card.titleClass"
            >
              {{ card.title }}
            </h3>
            <div
              class="mt-[13px] flex flex-1 items-center justify-center rounded-[22px] bg-white px-[21px] py-4 2xl:h-[140px] 2xl:w-[337px] 2xl:flex-none 2xl:px-[21.5px]"
            >
              <p
                class="text-center text-[16px] font-semibold leading-[27px] text-text-tertiary"
              >
                {{ card.body }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <div class="relative">
      <!-- Decorative grid behind carousel + steps -->
      <div
        class="pointer-events-none absolute left-1/2 top-[250px] z-0 hidden h-[529px] w-[904px] -translate-x-1/2 [mask-image:radial-gradient(ellipse_at_center,#000_25%,transparent_72%)] lg:block"
        :style="gridStyle"
        aria-hidden="true"
      />

      <!-- Carousel -->
      <section class="relative z-10 px-5 pt-8 lg:pt-[31px] xl:px-0">
        <m-calc-divider />

        <div
          class="mx-auto mt-10 flex w-full max-w-[1100px] flex-col items-center gap-10 lg:mt-[54px] lg:flex-row lg:justify-between lg:gap-[93px]"
        >
          <div
            class="flex w-full flex-col items-start lg:w-[396px] lg:shrink-0"
          >
            <span
              class="inline-flex h-8 items-center rounded-xl bg-accent-300 px-2 text-[14px] font-semibold text-accent-500"
            >
              رزومه‌ساز های‌حساب
            </span>
            <h2
              class="mt-4 font-yb-bold text-[24px] leading-[1.7] text-text-primary sm:text-[28px]"
            >
              رزومه ساز های‌حساب چطور
              <br />
              باعث افزایش درآمد شما می‌شود ؟
            </h2>
            <IntentLink
              to="/dashboard/cv"
              role="job_seeker"
              class="btn btn-success mt-4 h-10 w-[179px] px-4"
            >
              رایگان رزومه بساز
            </IntentLink>
          </div>

          <!-- Slide (desktop: notched card) -->
          <div class="relative hidden h-[335px] w-[611px] shrink-0 md:block">
            <img
              :src="carouselCard"
              alt=""
              class="absolute left-0 top-[69px] h-[208px] w-[617px] max-w-none"
            />
            <div
              class="absolute left-[47px] top-0 h-[123px] w-[129px]"
              aria-hidden="true"
            >
              <span
                class="absolute left-[2px] top-[28px] h-[100px] w-[102px] -rotate-[15deg] rounded-[22px] border border-dashed border-primary-300"
              />
              <span
                class="absolute left-[11px] top-[12px] h-[100px] w-[102px] rounded-[22px] bg-primary-100"
              />
              <template v-if="activeSlide.illustration === 'resume'">
                <img
                  :src="carouselHandsLeft"
                  alt=""
                  class="absolute left-[11px] top-[28px] h-[68.5px] w-[74.5px] max-w-none"
                />
                <img
                  :src="carouselHandRight"
                  alt=""
                  class="absolute left-[96px] top-[56px] h-[40.7px] w-[34px] max-w-none"
                />
                <img
                  :src="carouselPen"
                  alt=""
                  class="absolute left-[94px] top-[19px] size-7 max-w-none"
                />
                <img
                  :src="carouselUser"
                  alt=""
                  class="absolute left-[51px] top-[47px] size-[18px] max-w-none -rotate-[6deg]"
                />
              </template>
              <span
                v-else
                class="absolute left-[11px] top-[12px] flex h-[100px] w-[102px] items-center justify-center text-primary-500"
              >
                <Icon :name="activeSlide.icon" size="44" />
              </span>
            </div>

            <div
              class="absolute left-[215px] top-[69px] h-[7px] w-[393px] rounded-[4px] bg-primary-200 bg-repeat-x"
              :style="stripStyle"
              aria-hidden="true"
            />

            <h3
              class="absolute left-[128px] top-[112px] w-[461px] text-right font-yb-bold text-[21px] leading-[36px] text-primary-900"
            >
              {{ activeSlide.title }}
            </h3>
            <p
              class="absolute left-[30px] top-[162px] w-[559px] text-justify text-[18px] font-semibold leading-[31px] text-text-passive"
            >
              {{ activeSlide.body }}
            </p>

            <div
              dir="ltr"
              class="absolute left-1/2 top-[295px] flex -translate-x-1/2 items-center gap-4"
            >
              <button
                type="button"
                class="flex size-10 items-center justify-center rounded-lg bg-[#4a4a4a14] text-text-tertiary"
                aria-label="اسلاید قبلی"
                @click="showPreviousSlide"
              >
                <Icon name="lucide:arrow-left" size="22" />
              </button>
              <div class="flex items-center gap-2">
                <button
                  v-for="(slide, index) in slides"
                  :key="slide.title"
                  type="button"
                  class="h-1.5 w-1.5 rounded-[2px]"
                  :class="
                    index === activeSlideIndex
                      ? 'bg-primary-500'
                      : 'bg-text-muted'
                  "
                  :aria-label="`اسلاید ${index + 1}`"
                  @click="activeSlideIndex = index"
                />
              </div>
              <button
                type="button"
                class="flex size-10 items-center justify-center rounded-lg bg-[#4a4a4a14] text-text-tertiary"
                aria-label="اسلاید بعدی"
                @click="showNextSlide"
              >
                <Icon name="lucide:arrow-right" size="22" />
              </button>
            </div>
          </div>

          <!-- Slide (mobile: simple card) -->
          <div class="flex w-full flex-col items-center gap-4 md:hidden">
            <div
              class="w-full rounded-[22px] bg-white p-5 shadow-[4px_4px_0_#c6d2f7]"
            >
              <span
                class="mb-3 flex size-14 items-center justify-center rounded-[16px] bg-primary-100 text-primary-500"
              >
                <Icon :name="activeSlide.icon" size="28" />
              </span>
              <h3
                class="font-yb-bold text-[19px] leading-[1.8] text-primary-900"
              >
                {{ activeSlide.title }}
              </h3>
              <p
                class="mt-2 text-justify text-[16px] font-semibold leading-[1.9] text-text-passive"
              >
                {{ activeSlide.body }}
              </p>
            </div>
            <div dir="ltr" class="flex items-center gap-4">
              <button
                type="button"
                class="flex size-10 items-center justify-center rounded-lg bg-[#4a4a4a14]"
                aria-label="اسلاید قبلی"
                @click="showPreviousSlide"
              >
                <Icon name="lucide:arrow-left" size="22" />
              </button>
              <div class="flex items-center gap-2">
                <span
                  v-for="(slide, index) in slides"
                  :key="slide.title"
                  class="h-1.5 w-1.5 rounded-[2px]"
                  :class="
                    index === activeSlideIndex
                      ? 'bg-primary-500'
                      : 'bg-text-muted'
                  "
                />
              </div>
              <button
                type="button"
                class="flex size-10 items-center justify-center rounded-lg bg-[#4a4a4a14]"
                aria-label="اسلاید بعدی"
                @click="showNextSlide"
              >
                <Icon name="lucide:arrow-right" size="22" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Steps -->
      <section class="relative z-10 mt-12 px-5 xl:mt-[69px] xl:px-0">
        <BackgroundPattern position="left" side="-6.25rem" top="3%" />
        <BackgroundPattern position="right" side="-6.25rem" top="36%" />
        <BackgroundPattern position="left" side="-6.25rem" top="67%" />

        <div
          class="relative mx-auto flex w-full max-w-[944px] flex-col items-center"
        >
          <span
            class="inline-flex h-8 items-center rounded-xl bg-[#4864E114] px-2 text-[14px] font-semibold text-primary-500"
          >
            رزومه‌ساز های‌حساب
          </span>
          <h2
            class="mt-4 text-center font-yb-bold text-[24px] leading-[1.7] text-text-primary sm:text-[28px]"
          >
            رزومه‌ات در چند مرحله آماده است؟
          </h2>

          <div class="relative mt-6 flex w-full flex-col gap-8 xl:gap-[63px]">
            <!-- timeline (desktop only) -->
            <span
              class="absolute left-1/2 top-[98px] hidden h-[350px] w-1 -translate-x-1/2 rounded-full bg-[#dbdbdb] xl:block"
              aria-hidden="true"
            />
            <span
              class="absolute left-1/2 top-[54px] hidden size-[35px] -translate-x-1/2 rounded-full border-[6px] border-primary-500 bg-white xl:block"
              aria-hidden="true"
            />

            <div
              v-for="(step, index) in steps"
              :key="step.title"
              class="relative flex flex-col items-center justify-center gap-4 rounded-[20px] px-5 py-6 sm:flex-row sm:gap-6 xl:gap-[176px]"
              :class="index === 0 ? 'bg-surface-200 xl:px-20' : 'xl:py-0'"
            >
              <div class="flex shrink-0 items-center gap-3">
                <span
                  class="inline-flex h-[94px] w-7 rotate-180 items-center justify-center rounded-full text-[14px] font-semibold text-white [writing-mode:vertical-rl]"
                  :class="index === 0 ? 'bg-primary-500' : 'bg-[#dbdbdb]'"
                >
                  {{ step.label }}
                </span>
                <span
                  class="flex size-20 items-center justify-center rounded-[29px]"
                  :class="
                    index === 0
                      ? 'bg-primary-500 shadow-[2px_-2px_0_#4864e1]'
                      : 'bg-[#ebebeb] shadow-[5px_-3px_0_#ebebeb]'
                  "
                >
                  <img :src="step.icon" alt="" />
                </span>
              </div>
              <div class="w-full max-w-[302px] text-start">
                <p
                  class="font-yb-bold text-[18px] leading-[1.7]"
                  :class="index === 0 ? 'text-text-primary' : 'text-[#757575]'"
                >
                  {{ step.title }}
                </p>
                <p class="mt-[3px] text-[16px] leading-[1.7] text-[#757575]">
                  {{ step.body }}
                </p>
              </div>
            </div>
          </div>

          <IntentLink
            to="/dashboard/cv"
            role="job_seeker"
            class="btn btn-success mt-8 h-10 w-[179px] px-4 xl:mt-[74px]"
          >
            ساخت رزومه را شروع کن
          </IntentLink>
        </div>
      </section>
    </div>

    <!-- Quote -->
    <section class="relative mt-12 px-5 xl:mt-[74px] xl:px-0">
      <div class="relative mx-auto w-full max-w-[1134px]">
        <div
          class="pointer-events-none relative z-10 mx-auto hidden h-[182px] w-[368px] overflow-hidden sm:block"
          aria-hidden="true"
        >
          <img
            :src="phone"
            alt=""
            class="absolute left-[41px] top-[30px] w-[285px] max-w-none"
          />
          <div class="absolute left-[35px] top-[19px] h-[118px] w-[297px]">
            <div
              class="absolute inset-x-0 bottom-0 top-[30px] rounded-[10px] bg-[#d5efe5]"
            />
            <span
              class="absolute left-[16px] top-0 flex size-11 items-center justify-center rounded-full bg-[#006a43] text-white"
            >
              <Icon name="lucide:check" size="24" />
            </span>
            <span
              class="absolute left-[10px] top-[74px] size-[18px] rounded-full bg-[#006a43]"
            />
            <span
              class="absolute left-[26px] top-[66px] size-[26px] rounded-full bg-[#006a43]"
            />
            <span
              class="absolute left-[34px] top-[86px] size-[12px] rounded-full bg-[#006a43]"
            />
            <span
              class="absolute left-[8px] top-[96px] size-[14px] rounded-full bg-[#006a43]"
            />
            <Icon
              name="lucide:x"
              size="16"
              class="absolute right-[14px] top-[48px] text-text-primary"
            />
            <div class="absolute right-[44px] top-[45px] w-[196px] text-right">
              <p
                class="font-yb-bold text-[15px] leading-[24px] text-text-primary"
              >
                های‌حساب
              </p>
              <p class="mt-[2px] text-[12px] leading-[22px] text-text-primary">
                رزومه شما توسط کارفرما تایید شد
              </p>
            </div>
          </div>
        </div>

        <div
          class="relative min-h-[233px] overflow-hidden bg-[#e0ede8] sm:-mt-[34px]"
        >
          <div
            v-for="tab in quoteTabs"
            :key="tab.className"
            class="absolute hidden h-[75px] w-20 rounded-[18px] lg:block"
            :class="tab.className"
            aria-hidden="true"
          />
          <p
            class="relative mx-auto max-w-[940px] px-4 py-10 text-center text-[18px] font-semibold leading-[2] text-text-tertiary sm:pb-[39px] sm:pt-[50px] sm:text-[24px] sm:leading-[48px]"
          >
            رزومه‌ساز
            <span class="text-primary-500">های‌حساب</span>
            با تمرکز روی اطلاعاتی طراحی شده که برای
            <span class="font-yb-bold text-primary-500">استخدام حسابدار</span>
            اهمیت دارند؛ بنابراین به‌جای اینکه فقط یک قالب آماده تحویلت بدهد،
            کمک می‌کند
            <span class="font-yb-bold text-accent-500">تجربه و تخصصت</span>
            را
            <span class="font-yb-bold text-primary-500">ساختاریافته‌تر</span>
            ثبت کنی.
          </p>
        </div>
      </div>
    </section>

    <!-- Other services -->
    <section class="px-5 pb-2 pt-12 xl:px-0 xl:pt-[74px]">
      <div class="relative mx-auto w-full max-w-[1133px] xl:h-[320px]">
        <span
          class="pointer-events-none absolute right-0 top-[23px] z-10 hidden h-[274px] w-px bg-[#e8e8e8] xl:block"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute right-0 top-[60px] hidden size-[230px] rounded-full bg-[radial-gradient(circle,rgba(158,181,242,0.35)_0%,transparent_70%)] xl:block"
          aria-hidden="true"
        />

        <div
          class="relative flex h-full items-center gap-6 overflow-x-auto py-[31px] [scrollbar-width:none] xl:py-0 [&::-webkit-scrollbar]:hidden"
        >
          <div
            class="flex w-[176px] shrink-0 flex-col items-start gap-2 xl:mr-4"
          >
            <span
              class="inline-flex h-8 items-center rounded-xl bg-[#4864E114] px-2 text-[14px] font-semibold text-primary-500"
            >
              خدمات دیگر
            </span>
            <h2
              class="font-yb-bold text-[23px] leading-[1.7] text-text-primary"
            >
              خدمات مکمل برای کسب‌وکارها و حسابداران
            </h2>
          </div>

          <article
            v-for="service in services"
            :key="service.title"
            class="relative flex h-[258px] w-[353px] shrink-0 flex-col rounded-[18px] border border-[#e8e8e8] bg-white px-[51px] pb-[19px] pt-[44px]"
          >
            <span
              class="inline-flex h-6 w-fit items-center rounded-lg px-1 text-[13px] font-semibold"
              :class="service.badgeClass"
            >
              {{ service.badge }}
            </span>
            <h3
              class="mt-[4px] font-yb-bold text-[19px] leading-[32px] text-[#1d1f4e]"
            >
              {{ service.title }}
            </h3>
            <p class="mt-4 text-[13.4px] leading-[1.7] text-text-tertiary">
              {{ service.body }}
            </p>
            <IntentLink
              v-if="service.to"
              :to="service.to"
              :role="service.role"
              class="mt-auto flex h-[38px] items-center justify-center gap-1 rounded-lg bg-[#4864E114] text-[15px] font-semibold text-primary-500"
            >
              {{ service.action }}
              <img :src="externalLink" alt="" class="size-[22px]" />
            </IntentLink>
            <NuxtLink
              v-else
              :to="service.href"
              class="mt-auto flex h-[38px] items-center justify-center gap-1 rounded-lg bg-[#4864E114] text-[15px] font-semibold text-primary-500"
            >
              {{ service.action }}
              <img :src="externalLink" alt="" class="size-[22px]" />
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AccountRole } from "~/features/account/types";
import carouselCard from "~/assets/images/pages/cv-builder/carousel-card.svg";
import carouselDot from "~/assets/images/pages/cv-builder/carousel-dot.svg";
import carouselHandRight from "~/assets/images/pages/cv-builder/carousel-hand-right.svg";
import carouselHandsLeft from "~/assets/images/pages/cv-builder/carousel-hands-left.svg";
import carouselPen from "~/assets/images/pages/cv-builder/carousel-pen-front.svg";
import carouselUser from "~/assets/images/pages/cv-builder/carousel-user-front.svg";
import externalLink from "~/assets/images/pages/cv-builder/external-link.svg";
import heroBg from "~/assets/images/pages/cv-builder/hero-bg.png";
import heroIllustration from "~/assets/images/pages/cv-builder/hero-illustration.png";
import iconResume from "~/assets/images/pages/cv-builder/icon-resume.svg";
import iconSkills from "~/assets/images/pages/cv-builder/icon-skills.svg";
import iconUserCheck from "~/assets/images/pages/cv-builder/icon-user-check.svg";
import pdfBadge from "~/assets/images/pages/cv-builder/pdf.svg";
import phone from "~/assets/images/pages/cv-builder/phone.png";
import squiggle from "~/assets/images/pages/cv-builder/squiggle.svg";
import squiggleWarning from "~/assets/images/pages/cv-builder/squiggle-warning.svg";
import { paths } from "~/routes";

definePageMeta({ layout: "landing" });

// The hero artwork fades to black towards the bottom (measured from the design).
const heroGradient = [
  "rgba(0,0,0,.5) 0",
  "rgba(0,0,0,.43) 18px",
  "rgba(0,0,0,.21) 88px",
  "rgba(0,0,0,0) 188px",
  "rgba(0,0,0,0) 488px",
  "rgba(0,0,0,.19) 548px",
  "rgba(0,0,0,.46) 608px",
  "rgba(0,0,0,.64) 648px",
  "rgba(0,0,0,.79) 678px",
  "rgba(0,0,0,.93) 708px",
  "rgba(0,0,0,.99) 748px",
  "#000 795px",
].join(",");

const heroStyle = {
  backgroundImage: `linear-gradient(180deg,${heroGradient}),url(${heroBg})`,
  backgroundSize: "100% 100%, max(100%, 1536px) auto",
  backgroundPosition: "0 0, center -103px",
  backgroundRepeat: "no-repeat",
};

const gridTile = encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="102" height="102"><rect x="6" y="6" width="90" height="90" rx="14" fill="white" fill-opacity=".6"/></svg>',
);

const gridStyle = {
  backgroundImage: `url("data:image/svg+xml,${gridTile}")`,
  backgroundSize: "102px 102px",
};

const stripStyle = {
  backgroundImage: `url(${carouselDot})`,
  backgroundSize: "7px 7px",
};

const problemCards = [
  {
    title: "مهارت‌هایت مبهم می‌مانند",
    body: "وقتی مهارت‌ها به‌صورت کلی نوشته شوند، کارفرما نمی‌تواند تشخیص دهد تجربه اصلی تو در حسابداری مالی، مالیات، حقوق و دستمزد یا حوزه دیگری است.",
    shellClass: "border-[#708fea] bg-primary-200",
    titleClass: "text-[#1d1f4e]",
  },
  {
    title: "سطح تخصصت مشخص نیست",
    body: "مهارت در اکسل، نرم‌افزارهای حسابداری، مالیات و بیمه وقتی ارزشمندتر می‌شود که دقیق و ساختاریافته نمایش داده شود",
    shellClass: "border-accent-500 bg-[#c2f0d8]",
    titleClass: "text-[#008f5c]",
  },
  {
    title: "بخش مهم رزومه ممکن است دیده نشود",
    body: "در رزومه‌های عمومی، مهارت‌های تخصصی حسابداری بین توضیحات مختلف گم می‌شوند و پیدا کردن اطلاعات مهم برای کارفرما زمان بیشتری می‌برد.",
    shellClass: "border-[#78201b] bg-[#dcae82]",
    titleClass: "text-[#7b3d03]",
  },
];

const slides = [
  {
    title: "رزومه‌ای که برای حرفه حسابداری ساخته شده",
    body: "در رزومه‌ساز های‌حساب، اطلاعاتی ثبت می‌کنی که مستقیماً به استخدام در حوزه حسابداری مربوط‌اند؛ نه فقط یک عنوان شغلی و چند خط توضیح.",
    illustration: "resume",
    icon: "lucide:pen-line",
  },
  {
    title: "مهارت در نرم‌افزارهای حسابداری",
    body: "نرم‌افزارهایی که با آن‌ها کار کرده‌ای را ثبت کن و سطح مهارتت را مشخص کن؛ از Excel تا نرم‌افزارهای تخصصی حسابداری مثل سپیدار، همکاران سیستم و سایر ابزارهایی که در تجربه کاری‌ات استفاده کرده‌ای.",
    illustration: "icon",
    icon: "lucide:scan-eye",
  },
  {
    title: "مهارت‌های تخصصی حسابداری",
    body: "تجربه‌ات در حوزه‌هایی مثل تهیه و ثبت اسناد حسابداری، صورت‌های مالی، بهای تمام‌شده و سایر فعالیت‌های تخصصی را دقیق‌تر نشان بده.",
    illustration: "icon",
    icon: "lucide:layers",
  },
  {
    title: "مالیات و سامانه مؤدیان",
    body: "تجربه‌ات در تنظیم اظهارنامه، کار با سامانه مؤدیان و سایر فرایندهای مالیاتی را جداگانه و دقیق نمایش بده.",
    illustration: "icon",
    icon: "lucide:landmark",
  },
  {
    title: "بیمه، حقوق و دستمزد",
    body: "تجربه‌ات در محاسبه حقوق و دستمزد، ارسال لیست بیمه و سایر فرایندهای مرتبط را در بخشی مجزا نمایش بده.",
    illustration: "icon",
    icon: "lucide:shield-check",
  },
];

const activeSlideIndex = ref(0);
const activeSlide = computed(() => slides[activeSlideIndex.value]!);

function showPreviousSlide() {
  activeSlideIndex.value =
    (activeSlideIndex.value - 1 + slides.length) % slides.length;
}

function showNextSlide() {
  activeSlideIndex.value = (activeSlideIndex.value + 1) % slides.length;
}

const steps = [
  {
    title: "۱. اطلاعات و سابقه کاری‌ات را وارد کن",
    body: "اطلاعات پایه، تحصیلات، سوابق شغلی و تجربه‌های مرتبطت را ثبت کن.",
    label: "مرحله اول",
    icon: iconUserCheck,
  },
  {
    title: "۲. مهارت های حسابداری ات را مشخص کن",
    body: "نرم افزار ها و مهارت های تخصصی ای که در آنها تجربه داری را انتخاب کن و سطح مهارتت را مشخص کن.",
    label: "مرحله دوم",
    icon: iconSkills,
  },
  {
    title: "۳. رزومه ات را کامل کن",
    body: "اطلاعاتت در یک ساختار تخصصی و منظم قرار میگیرد و رزومه ات برای استفاده در فرصت های شغلی آماده می شود.",
    label: "مرحله سوم",
    icon: iconResume,
  },
];

// Decorative mint tabs on both sides of the quote panel.
const quoteTabs = [
  {
    className: "left-0.5 top-[0] bg-[linear-gradient(90deg,#9fe6c6,#d6e4ee)]",
  },
  {
    className:
      "left-0.5 top-[78px] bg-[linear-gradient(90deg,#a9dfd2,#c9d6f4)]",
  },
  {
    className:
      "left-0.5 top-[156px] bg-[linear-gradient(90deg,#9fe6c6,#d9e8e8)]",
  },
  {
    className: "right-0 top-[0] bg-[linear-gradient(270deg,#9fe6c6,#e0ede8)]",
  },
  {
    className:
      "right-0 top-[78px] bg-[linear-gradient(270deg,#9fe6c6,#e0ede8)]",
  },
  {
    className:
      "right-0 top-[156px] bg-[linear-gradient(270deg,#9fe6c6,#e0ede8)]",
  },
];

const services: {
  badge: string;
  badgeClass: string;
  title: string;
  body: string;
  action: string;
  href?: string;
  to?: string;
  role?: AccountRole;
}[] = [
  {
    badge: "تکمیل اظهارنامه",
    badgeClass: "bg-[#b95c0414] text-warning-500",
    title: "تکمیل اظهارنامه مالیاتی",
    body: "جدیدترین فرصت های شغلی حسابداری را مشاهده کنید و رزومه خود را برای شرکت ها و کسب وکارهای فعال ارسال کنید.",
    action: "اظهارنامه",
    href: paths.taxReturn.root,
  },
  {
    badge: "رزومه ساز",
    badgeClass: "bg-accent-300 text-accent-500",
    title: "رزومه ساز حسابداری",
    body: "با رزومه ساز حسابداری، رزومه حرفه ای و استاندارد خود را بسازید و برای فرصت های شغلی حسابداری اقدام کنید.",
    action: "رزومه ساز",
    to: "/dashboard/cv",
    role: "job_seeker",
  },
  {
    badge: "استخدام نیرو",
    badgeClass: "bg-[#4864E114] text-primary-500",
    title: "استخدام و جذب حسابدار",
    body: "برای استخدام حسابدار و جذب نیرو، آگهی استخدام ثبت کنید و رزومه حسابداران متخصص را بررسی کنید.",
    action: "استخدام حسابدار",
    to: paths.employer.adsCreate,
    role: "employer",
  },
];

useSeoMeta({
  title: "رزومه ساز حسابداری، تخصصی و رایگان | های‌حساب",
  description:
    "با رزومه‌ساز تخصصی حسابداری، مهارت و تجربه‌تان را شفاف به کارفرما نشان دهید و شانس استخدامتان را بیشتر کنید؛ همین حالا رزومه‌تان را بسازید.",
});
</script>
