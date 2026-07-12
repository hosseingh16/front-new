<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-backdrop fixed inset-0 z-100 flex items-center justify-center p-6 md:p-10"
      dir="rtl"
      @keydown.escape="handleClose"
      @click.self="handleClose"
    >
      <div class="relative w-full max-w-[1580px]" @click.stop>
        <button
          type="button"
          class="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:h-11 md:w-11"
          aria-label="رزومه قبلی"
          :disabled="!canGoPrev || loading"
          @click="goPrev"
        >
          <Icon name="lucide:chevron-left" size="20" />
        </button>

        <button
          type="button"
          class="absolute right-0 top-1/2 z-20 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:h-11 md:w-11"
          aria-label="رزومه بعدی"
          :disabled="!canGoNext || loading"
          @click="goNext"
        >
          <Icon name="lucide:chevron-right" size="20" />
        </button>

        <div
          class="relative flex h-[92vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-resume-modal-title"
        >
          <header
            class="shrink-0 border-b border-surface-200 px-4 py-4 md:px-6"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="flex min-w-0 items-center gap-1">
                <span
                  class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
                  aria-hidden="true"
                />
                <h2
                  id="user-resume-modal-title"
                  class="font-yb-bold text-base text-text-tertiary md:text-lg"
                >
                  جزئیات رزومه
                </h2>
              </div>

              <div class="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  class="flex h-9 items-center gap-1.5 rounded-lg border-2 border-gray-default bg-white px-3 text-sm text-text-tertiary transition-opacity hover:opacity-80 disabled:opacity-60"
                  :disabled="!resumeFileUrl"
                  @click="handleDownload"
                >
                  <Icon name="lucide:download" size="16" />
                  <span class="hidden sm:inline">دانلود رزومه</span>
                </button>

                <BookmarkToggleButton
                  v-if="request"
                  :target-id="request.id"
                  type="requests"
                  label="نشان کردن"
                />

                <button
                  type="button"
                  class="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-gray-default bg-white text-text-tertiary transition-opacity hover:opacity-80"
                  aria-label="اطلاعات"
                >
                  <Icon name="lucide:info" size="16" />
                </button>

                <button
                  type="button"
                  class="flex h-9 w-9 items-center justify-center rounded-lg text-text-tertiary transition-opacity hover:opacity-80"
                  aria-label="بستن"
                  @click="handleClose"
                >
                  <Icon name="svg:close" size="20" />
                </button>
              </div>
            </div>
          </header>

          <div class="min-h-0 flex-1 overflow-hidden px-4 py-4 md:px-6">
            <div
              class="h-full min-h-0 overflow-y-auto overscroll-contain rounded-xl p-4 scrollbar-gutter-stable scrollbar-thin [scrollbar-color:var(--color-surface-200)_transparent] md:p-5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-surface-200 [&::-webkit-scrollbar-track]:bg-transparent"
            >
              <p v-if="userError" class="py-12 text-center text-sm text-error">
                {{ userError }}
              </p>

              <UserResumeDetailContent
                v-else
                :user="user"
                :loading="userLoading"
                embedded
              />
            </div>
          </div>

          <footer
            v-if="request"
            class="shrink-0 border-t border-surface-200 bg-white px-4 py-4 md:px-6"
          >
            <div
              class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="flex items-center gap-2">
                <span class="text-sm text-text-passive">وضعیت درخواست:</span>
                <AdRequestStatusBadge :request="request" />
              </div>

              <div class="flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="flex h-10 items-center gap-1.5 rounded-lg border-2 border-[#EF4035] bg-white px-4 text-sm font-semibold text-[#EF4035] transition-opacity hover:opacity-80 disabled:opacity-60"
                  :disabled="actionLoading || isRejected"
                  @click="emit('reject', request.id)"
                >
                  <Icon name="material-symbols:close-rounded" size="18" />
                  رد کردن
                </button>

                <button
                  type="button"
                  class="flex h-10 items-center gap-2 rounded-lg bg-[#009F65] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  :disabled="actionLoading || isApproved"
                  @click="emit('confirm', request.id)"
                >
                  <Icon name="lucide:check-check" size="18" />
                  تایید درخواست
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import AdRequestStatusBadge from "~/components/Elements/AdRequestStatusBadge.vue";
import BookmarkToggleButton from "~/components/Elements/BookmarkToggleButton.vue";
import UserResumeDetailContent from "./UserResumeDetailContent.vue";
import type { EmployerAdRequest } from "~/types/employer-ad-request";
import { resolveAdRequestStatusKey } from "~/pages/dashboard/employer/utils/employer-ad-request";
import { resolveResumeAttachment } from "../utils/user-resume";

const props = defineProps<{
  open: boolean;
  request: EmployerAdRequest | null;
  requests?: EmployerAdRequest[];
  actionLoading?: boolean;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  "update:request": [value: EmployerAdRequest];
  confirm: [requestId: number];
  reject: [requestId: number];
}>();

const { $toast } = useNuxtApp();

const userId = computed(() => props.request?.user?.id ?? 0);
const { user, loading: userLoading, error: userError } = useUser(userId);

const currentIndex = computed(() => {
  if (!props.request) return -1;
  return (props.requests ?? []).findIndex(
    (item) => item.id === props.request?.id,
  );
});

const canGoPrev = computed(() => currentIndex.value > 0);
const canGoNext = computed(
  () =>
    currentIndex.value >= 0 &&
    currentIndex.value < (props.requests?.length ?? 0) - 1,
);

const loading = computed(
  () => userLoading.value || Boolean(props.actionLoading),
);

const statusKey = computed(() =>
  props.request ? resolveAdRequestStatusKey(props.request) : null,
);

const isApproved = computed(() => statusKey.value === "approved");
const isRejected = computed(() => statusKey.value === "rejected");

const resumeFileUrl = computed(() => {
  const attachment = resolveResumeAttachment(user.value);
  return attachment?.url ?? null;
});

function handleClose() {
  emit("update:open", false);
}

function goPrev() {
  if (!canGoPrev.value || !props.requests?.length) return;
  const prevRequest = props.requests[currentIndex.value - 1];
  if (prevRequest) emit("update:request", prevRequest);
}

function goNext() {
  if (!canGoNext.value || !props.requests?.length) return;
  const nextRequest = props.requests[currentIndex.value + 1];
  if (nextRequest) emit("update:request", nextRequest);
}

function handleDownload() {
  if (!resumeFileUrl.value) {
    $toast.error("فایل رزومه برای دانلود موجود نیست");
    return;
  }

  if (!import.meta.client) return;
  window.open(resumeFileUrl.value, "_blank", "noopener,noreferrer");
}

watch(
  () => props.open,
  (isOpen) => {
    if (!import.meta.client) return;
    document.body.style.overflow = isOpen ? "hidden" : "";
  },
);

onUnmounted(() => {
  if (!import.meta.client) return;
  document.body.style.overflow = "";
});
</script>
