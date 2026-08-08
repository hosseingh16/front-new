<template>
  <dialog
    ref="dialogRef"
    class="modal"
    dir="rtl"
    aria-labelledby="my-request-detail-title"
    @click="handleBackdropClick"
  >
    <div
      class="modal-box w-[calc(100%-1.5rem)] max-h-[90vh] overflow-y-auto rounded-2xl bg-surface-50 p-4 sm:p-6"
      :style="`max-width:${width}px`"
      @click.stop
    >
      <div class="mb-4 flex items-start justify-between gap-3">
        <h2
          id="my-request-detail-title"
          class="min-w-0 flex-1 text-right font-yb-bold text-xl leading-[1.7] text-text-primary sm:text-h1"
        >
          {{ request?.job_title }}
        </h2>

        <div class="flex shrink-0 items-center gap-2">
          <NuxtLink
            v-if="request"
            :to="`/jobs/${request.ad_id}`"
            class="btn btn-primary inline-flex h-10 items-center gap-1 px-4 text-base font-semibold"
            @click="closeModal"
          >
            مشاهده آگهی
            <Icon name="svg:receive-briefcase" size="24" class="size-6 shrink-0" />
          </NuxtLink>

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg text-text-passive transition-opacity hover:opacity-80"
            aria-label="بستن"
            @click="closeModal"
          >
            <Icon name="svg:close" size="20" />
          </button>
        </div>
      </div>

      <div
        v-if="request"
        class="flex flex-col gap-4 lg:flex-row lg:items-start"
      >
        <section
          class="min-w-0 flex-1 rounded-2xl bg-white p-4 text-right sm:p-6"
        >
          <Titr class="mb-4!">وضعیت درخواست‌ها و پیام‌ها</Titr>

          <ol class="flex flex-col gap-2">
            <li
              v-for="(event, index) in timeline"
              :key="event.id"
              class="flex items-start gap-2"
            >
              <div class="flex w-8 shrink-0 flex-col items-center gap-2">
                <div
                  class="flex size-8 items-center justify-center overflow-hidden rounded-full"
                  :class="actorAvatarClass(event.actor)"
                >
                  <img
                    v-if="actorImage(event.actor)"
                    :src="actorImage(event.actor)!"
                    :alt="actorAlt(event.actor)"
                    class="size-7 rounded-full object-cover"
                  />
                  <Icon
                    v-else-if="event.actor === 'platform'"
                    name="svg:home"
                    size="16"
                    class="text-primary-500"
                  />
                  <Icon
                    v-else
                    name="svg:user-2"
                    size="16"
                    class="text-text-passive"
                  />
                </div>
                <div
                  v-if="index < timeline.length - 1"
                  class="min-h-10 w-px flex-1 bg-gray-default"
                  aria-hidden="true"
                />
              </div>

              <div class="flex min-w-0 flex-1 flex-col items-start gap-1 text-right">
                <p
                  v-if="formatEventDate(event.date)"
                  class="w-full pt-1.5 text-sm leading-[1.7] text-text-passive"
                >
                  {{ formatEventDate(event.date) }}
                </p>

                <div
                  v-if="event.showContactCta"
                  class="flex w-full flex-wrap items-center justify-between gap-2"
                >
                  <NuxtLink
                    to="/contact"
                    class="inline-flex h-8 items-center gap-1 rounded-md bg-[rgba(72,100,225,0.08)] px-3 text-sm font-semibold text-primary-500"
                    @click="closeModal"
                  >
                    ارتباط با ما
                    <Icon name="lucide:message-circle-more" size="20" />
                  </NuxtLink>
                  <p
                    v-if="event.title"
                    class="text-base font-semibold leading-[1.7] text-text-secondary"
                  >
                    {{ event.title }}
                  </p>
                </div>

                <p
                  v-else
                  class="w-full text-base font-semibold leading-[1.7] text-text-secondary"
                >
                  {{ event.title }}
                </p>

                <p class="w-full text-sm leading-[1.7] text-text-tertiary">
                  {{ event.description }}
                </p>

                <div
                  v-if="event.rejectReason"
                  class="mt-1 w-full rounded-lg border border-dashed border-gray-default bg-white p-2 text-right text-base leading-[1.7] text-text-primary"
                >
                  {{ event.rejectReason }}
                </div>
              </div>
            </li>
          </ol>
        </section>

        <aside
          class="flex w-full shrink-0 flex-col items-stretch gap-3 rounded-lg border border-gray-default bg-white px-3 pb-3 pt-10 text-right lg:w-[302px]"
        >
          <div class="flex w-full flex-col items-center">
            <div
              class="flex size-[92px] items-center justify-center overflow-hidden rounded-[23px] bg-[#ECF4D9] shadow-[0px_2px_4px_0px_rgba(140,156,237,0.05),0px_4px_24px_0px_rgba(175,190,255,0.06)]"
            >
              <img
                :src="companyLogoSrc"
                :alt="request.company_name"
                class="size-[82px] rounded-[20px] object-cover"
              />
            </div>
          </div>

          <div class="flex w-full flex-col items-center gap-1 text-center">
            <p class="text-base leading-[1.7] text-text-secondary">
              {{ request.company_name }}
            </p>
            <p
              class="font-yb-bold text-xl leading-[1.7] text-text-primary sm:text-h1"
            >
              {{ request.job_title }}
            </p>
          </div>

          <a
            v-if="websiteHref"
            :href="websiteHref"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center gap-2 self-center text-base leading-[1.7] text-primary-500"
          >
            {{ websiteLabel }}
            <Icon name="lucide:external-link" size="20" class="shrink-0" />
          </a>

          <div
            v-for="item in sidebarItems"
            :key="item.label"
            class="flex w-full items-center justify-start gap-1 text-sm leading-[1.7]"
          >
            <Icon
              :name="item.icon"
              size="20"
              class="shrink-0 text-text-passive"
            />
            <span class="shrink-0 text-text-passive">{{ item.label }}:</span>
            <span class="text-text-secondary">{{ item.value }}</span>
          </div>
        </aside>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import Titr from '~/features/panel/cv/Titr.vue'
import type { MyRequest, MyRequestTimelineActor } from '~/types/my-request'
import { buildMyRequestTimeline } from '~/pages/dashboard/utils/my-request-timeline'
import { formatJalaliDate } from '~/utils/format-jalali-date'
import { resolveCompanyLogoDisplaySrc } from '~/utils/company-basic-info'
import { useCurrentUser } from '~/composables/useCurrentUser'

const props = withDefaults(
  defineProps<{
    request: MyRequest | null
    width?: number
  }>(),
  {
    width: 1100,
  },
)

const dialogRef = ref<HTMLDialogElement | null>(null)
const { avatar: userAvatar } = useCurrentUser()

const companyLogoSrc = computed(() =>
  resolveCompanyLogoDisplaySrc(props.request?.company_logo),
)

const timeline = computed(() =>
  props.request ? buildMyRequestTimeline(props.request) : [],
)

const locationLabel = computed(() => {
  if (!props.request) return ''
  const parts = [props.request.province_name, props.request.city_name].filter(
    Boolean,
  )
  return parts.join('، ')
})

const workExperienceLabel = computed(() => {
  const value = props.request?.minimum_work_experience
  if (!value) return ''
  return value.includes('سال') ? value : `${value} سال`
})

const websiteLabel = computed(() => {
  const website = props.request?.company_website?.trim()
  if (!website) return ''
  return website.replace(/^https?:\/\//i, '').replace(/\/$/, '')
})

const websiteHref = computed(() => {
  const website = props.request?.company_website?.trim()
  if (!website) return ''
  if (/^https?:\/\//i.test(website)) return website
  return `https://${website}`
})

const sidebarItems = computed(() => {
  if (!props.request) return []

  const items = [
    {
      label: 'نوع آگهی',
      value: props.request.ad_type || 'استخدامی',
      icon: 'svg:bag-1',
    },
    {
      label: 'گروه شغلی',
      value: props.request.category || '',
      icon: 'svg:bag-1',
    },
    {
      label: 'نوع قرارداد',
      value: props.request.employment_type || '',
      icon: 'tabler:file-text',
    },
    {
      label: 'موقعیت مکانی',
      value: locationLabel.value,
      icon: 'svg:location-4',
    },
    {
      label: 'حقوق',
      value: props.request.salary || '',
      icon: 'svg:wallet',
    },
    {
      label: 'سابقه کار',
      value: workExperienceLabel.value,
      icon: 'svg:work-history',
    },
    {
      label: 'مدرک تحصیلی',
      value: props.request.minimum_degree || '',
      icon: 'svg:edu-item',
    },
    {
      label: 'جنسیت',
      value: props.request.gender || 'مهم نیست',
      icon: 'svg:user-2',
    },
    {
      label: 'تاریخ انتشار آگهی',
      value: formatJalaliDate(props.request.publish_date, 'jD jMMMM'),
      icon: 'lucide:calendar-clock',
    },
  ]

  return items.filter((item) => Boolean(item.value))
})

function formatEventDate(date?: string | null) {
  return formatJalaliDate(date, 'jD jMMMM jYYYY')
}

function actorImage(actor: MyRequestTimelineActor) {
  if (actor === 'company') return companyLogoSrc.value
  if (actor === 'user') return userAvatar.value
  if (actor === 'platform') return '/images/logo.png'
  return null
}

function actorAlt(actor: MyRequestTimelineActor) {
  if (actor === 'company') return props.request?.company_name || 'شرکت'
  if (actor === 'user') return 'کاربر'
  return 'های‌حساب'
}

function actorAvatarClass(actor: MyRequestTimelineActor) {
  if (actor === 'platform') return 'bg-[rgba(72,100,225,0.08)]'
  if (actor === 'company') return 'bg-[#ECF4D9]'
  return 'bg-surface-200'
}

function showModal() {
  dialogRef.value?.showModal()
}

function closeModal() {
  dialogRef.value?.close()
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

defineExpose({
  showModal,
  closeModal,
})
</script>
