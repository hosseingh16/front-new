<template>
  <div
    class="sticky top-0 z-30 border-b border-surface-200/80 bg-white/90 backdrop-blur-md"
  >
    <div
      class="custom-pad mx-auto flex max-w-384 flex-wrap items-center justify-between gap-3 py-3"
    >
      <div class="flex min-w-0 items-center gap-3">
        <NuxtLink
          to="/"
          class="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          <NuxtImg src="/images/logo.png" alt="های‌حساب" class="h-9 w-9" />
          <div class="hidden text-right sm:block">
            <p class="font-yb-bold text-sm text-text-tertiary">های‌حساب</p>
            <p class="text-[11px] text-text-passive">خانه حسابداران با تجربه</p>
          </div>
        </NuxtLink>

        <span
          v-if="title"
          class="hidden h-6 w-px bg-surface-200 md:block"
          aria-hidden="true"
        />

        <p
          v-if="title"
          class="hidden min-w-0 truncate text-sm font-semibold text-text-tertiary md:block"
        >
          {{ title }}
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-2">
        <div
          class="flex items-center gap-1 rounded-xl border border-surface-200 bg-surface-50 p-1"
          role="group"
          aria-label="اشتراک‌گذاری"
        >
          <button
            v-for="item in socialLinks"
            :key="item.id"
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-white"
            :aria-label="item.label"
            @click="item.onClick()"
          >
            <img
              :src="item.icon"
              :alt="item.label"
              width="20"
              height="20"
              class="h-5 w-5"
            />
          </button>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/dashboard/cv"
            class="flex h-10 items-center gap-2 rounded-xl border-2 border-gray-default bg-white px-4 text-sm font-semibold text-text-tertiary transition-opacity hover:opacity-80"
          >
            <Icon name="svg:edit" size="18" />
            <span>ویرایش رزومه</span>
          </NuxtLink>

          <button
            type="button"
            class="flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-4 text-sm font-yb-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="downloading"
            @click="downloadPdf"
          >
            <Icon
              :name="downloading ? 'lucide:loader-circle' : 'lucide:download'"
              size="18"
              class="text-white"
              :class="{ 'animate-spin': downloading }"
            />
            <span>{{
              downloading ? "در حال آماده‌سازی..." : "دانلود رزومه"
            }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import linkIcon from "~/assets/vectors/social/link.svg?url";
import linkedinIcon from "~/assets/vectors/social/linkedin.svg?url";
import telegramIcon from "~/assets/vectors/social/telegram.svg?url";
import twitterIcon from "~/assets/vectors/social/twitter.svg?url";
import whatsappIcon from "~/assets/vectors/social/whatsapp.svg?url";
import type { ApiResponse } from "~/types/api";

const props = defineProps<{
  slug: string;
  title?: string;
}>();

const api = useApi();
const { $toast } = useNuxtApp();
const downloading = ref(false);

function getShareUrl() {
  if (!import.meta.client) return "";
  return window.location.href;
}

function openShare(url: string) {
  if (!import.meta.client) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function shareOnLinkedIn() {
  openShare(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      getShareUrl(),
    )}`,
  );
}

function shareOnTwitter() {
  openShare(
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}`,
  );
}

function shareOnTelegram() {
  openShare(`https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}`);
}

function shareOnWhatsapp() {
  openShare(`https://wa.me/?text=${encodeURIComponent(getShareUrl())}`);
}

async function copyShareLink() {
  if (!import.meta.client) return;
  try {
    await navigator.clipboard.writeText(getShareUrl());
    $toast.success("لینک کپی شد");
  } catch {
    $toast.error("کپی لینک ممکن نشد");
  }
}

const socialLinks = [
  {
    id: "linkedin",
    icon: linkedinIcon,
    label: "اشتراک در لینکدین",
    onClick: shareOnLinkedIn,
  },
  {
    id: "twitter",
    icon: twitterIcon,
    label: "اشتراک در توییتر",
    onClick: shareOnTwitter,
  },
  {
    id: "telegram",
    icon: telegramIcon,
    label: "اشتراک در تلگرام",
    onClick: shareOnTelegram,
  },
  {
    id: "whatsapp",
    icon: whatsappIcon,
    label: "اشتراک در واتساپ",
    onClick: shareOnWhatsapp,
  },
  { id: "link", icon: linkIcon, label: "کپی لینک", onClick: copyShareLink },
];

async function downloadPdf() {
  if (!props.slug || downloading.value) return;

  downloading.value = true;
  try {
    const result = await api.get<
      ApiResponse<{ filename: string; url: string }>
    >(`/cv/${props.slug}/pdf`);

    const url = result.data?.url;
    if (!url) {
      $toast.error("دانلود رزومه ممکن نشد");
      return;
    }

    if (import.meta.client) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  } catch {
    $toast.error("دانلود رزومه ممکن نشد");
  } finally {
    downloading.value = false;
  }
}
</script>
