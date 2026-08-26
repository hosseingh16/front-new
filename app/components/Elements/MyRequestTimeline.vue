<template>
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
          class="mt-1 w-full rounded-lg border border-dashed border-gray-default bg-white p-2 text-right text-base leading-[1.7] text-text-primay"
        >
          {{ event.rejectReason }}
        </div>
      </div>
    </li>
  </ol>
</template>

<script setup lang="ts">
import type { MyRequest, MyRequestTimelineActor } from "~/types/my-request";
import { buildMyRequestTimeline } from "~/pages/dashboard/utils/my-request-timeline";
import { formatJalaliDate } from "~/utils/format-jalali-date";
import { resolveCompanyLogoDisplaySrc } from "~/utils/company-basic-info";
import { useCurrentUser } from "~/composables/useCurrentUser";

const props = defineProps<{
  request: MyRequest;
}>();

const { avatar: userAvatar } = useCurrentUser();

const companyLogoSrc = computed(() =>
  resolveCompanyLogoDisplaySrc(props.request.company_logo),
);

const timeline = computed(() => buildMyRequestTimeline(props.request));

function formatEventDate(date?: string | null) {
  return formatJalaliDate(date, "jD jMMMM jYYYY");
}

function actorImage(actor: MyRequestTimelineActor) {
  if (actor === "company") return companyLogoSrc.value;
  if (actor === "user") return userAvatar.value;
  if (actor === "platform") return "/images/logo.png";
  return null;
}

function actorAlt(actor: MyRequestTimelineActor) {
  if (actor === "company") return props.request.company_name || "شرکت";
  if (actor === "user") return "کاربر";
  return "های‌حساب";
}

function actorAvatarClass(actor: MyRequestTimelineActor) {
  if (actor === "platform") return "bg-[rgba(72,100,225,0.08)]";
  if (actor === "company") return "bg-[#ECF4D9]";
  return "bg-surface-200";
}
</script>
