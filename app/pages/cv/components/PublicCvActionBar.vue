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
          class="min-w-0 truncate text-sm font-semibold text-text-tertiary md:block"
        >
          {{ title }}
        </p>
      </div>

      <div
        class="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto sm:justify-end"
      >
        <div
          class="flex w-full items-center justify-between gap-1 rounded-xl border border-surface-200 bg-surface-50 p-1 sm:w-auto sm:justify-start"
          role="group"
          aria-label="اشتراک‌گذاری"
        >
          <button
            v-for="item in socialLinks"
            :key="item.id"
            type="button"
            class="flex h-9 w-9 flex-1 items-center justify-center rounded-lg transition-colors hover:bg-white sm:flex-none"
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

        <div
          class="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:justify-end"
        >
          <NuxtLink
            :to="paths.taxReturn.consultants"
            class="flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-default bg-white px-4 text-sm font-semibold text-text-tertiary transition-opacity hover:opacity-80 sm:w-auto"
          >
            <Icon name="lucide:chevron-right" size="18" />
            <span>لیست مشاوران</span>
          </NuxtLink>

          <NuxtLink
            v-if="canEditResume"
            to="/dashboard/cv"
            class="flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-default bg-white px-4 text-sm font-semibold text-text-tertiary transition-opacity hover:opacity-80 sm:w-auto"
          >
            <Icon name="svg:edit" size="18" />
            <span>ویرایش رزومه</span>
          </NuxtLink>

          <button
            v-if="canDownloadResume"
            type="button"
            class="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 text-sm font-yb-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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

          <button
            type="button"
            class="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-success-500 px-2 text-sm font-yb-bold text-white transition-opacity hover:opacity-90 sm:w-auto"
            @click="openRequestModal"
          >
            <Icon name="lucide:users" size="18" class="text-white" />
            <span>درخواست مشاوره</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <TaxReturnRequestModal ref="requestModalRef" />
</template>

<script setup lang="ts">
import linkIcon from "~/assets/vectors/social/link.svg?url";
import linkedinIcon from "~/assets/vectors/social/linkedin.svg?url";
import telegramIcon from "~/assets/vectors/social/telegram.svg?url";
import twitterIcon from "~/assets/vectors/social/twitter.svg?url";
import whatsappIcon from "~/assets/vectors/social/whatsapp.svg?url";
import TaxReturnRequestModal from "~/pages/tax-return/components/TaxReturnRequestModal.vue";
import { paths } from "~/routes";

const props = defineProps<{
  slug: string;
  title?: string;
  resumeUserId?: number | null;
}>();

const api = useApi();
const { $toast } = useNuxtApp();
const { isAuthenticated } = useSanctumAuth();
const { user, isEmployer, ensureFullProfile } = useCurrentUser();
const downloading = ref(false);
const requestModalRef = ref<InstanceType<typeof TaxReturnRequestModal> | null>(
  null,
);

const canDownloadResume = computed(() =>
  Boolean(isAuthenticated.value && isEmployer.value),
);

const canEditResume = computed(() => {
  if (!isAuthenticated.value || !user.value) return false;

  if (props.resumeUserId != null && user.value.id != null) {
    return Number(user.value.id) === Number(props.resumeUserId);
  }

  const currentSlug = String(user.value.cv_slug ?? "").trim();
  return Boolean(currentSlug) && currentSlug === props.slug.trim();
});

onMounted(() => {
  if (isAuthenticated.value) {
    void ensureFullProfile();
  }
});

function openRequestModal() {
  requestModalRef.value?.showModal();
}

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
  if (!canDownloadResume.value || downloading.value || !import.meta.client)
    return;

  downloading.value = true;
  try {
    const blob = await api.get<Blob>("/cv/pdf-link", {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!(blob instanceof Blob) || blob.size === 0) {
      $toast.error("دانلود رزومه ممکن نشد");
      return;
    }

    if (
      blob.type.includes("json") ||
      blob.type.includes("text") ||
      blob.type.includes("html")
    ) {
      $toast.error("دانلود رزومه ممکن نشد");
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "resume.pdf";
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    $toast.error("دانلود رزومه ممکن نشد");
  } finally {
    downloading.value = false;
  }
}
</script>
