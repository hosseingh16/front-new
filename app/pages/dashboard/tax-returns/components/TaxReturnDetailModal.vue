<template>
  <dialog ref="dialogRef" class="modal" @click="handleBackdropClick">
    <div
      class="modal-box max-h-[90vh] overflow-y-auto p-0"
      :style="`max-width:${width}px`"
      @click.stop
    >
      <div
        class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-default bg-white px-5 py-4"
      >
        <div class="flex items-center gap-2">
          <span
            class="h-1 w-2 shrink-0 rounded-full bg-linear-to-b from-[#3B6EF8] to-primary-500"
            aria-hidden="true"
          />
          <h2 class="font-yb-bold text-base text-text-tertiary">
            جزئیات درخواست
          </h2>
        </div>

        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary transition-opacity hover:opacity-80"
          aria-label="بستن"
          @click="closeModal"
        >
          <Icon name="svg:close" size="20" />
        </button>
      </div>

      <div class="px-5 py-5">
        <div v-if="loading" class="space-y-5">
          <div class="h-7 w-28 animate-pulse rounded-lg bg-surface-200" />
          <div class="grid gap-5 sm:grid-cols-2">
            <div v-for="n in 6" :key="`skeleton-${n}`" class="space-y-2">
              <div class="h-3 w-20 animate-pulse rounded bg-surface-200" />
              <div class="h-5 w-36 animate-pulse rounded bg-surface-200" />
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 w-16 animate-pulse rounded bg-surface-200" />
            <div class="h-20 w-full animate-pulse rounded-xl bg-surface-200" />
          </div>
        </div>

        <p v-else-if="error" class="py-10 text-center text-sm text-error">
          {{ error }}
        </p>

        <div v-else-if="detail" class="space-y-6">
          <section>
            <Titr>اطلاعات هویتی و تماس</Titr>
            <div class="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p class="text-sm text-text-passive">نام:</p>
                <p
                  class="mt-2 font-semibold"
                  :class="
                    detail.name?.trim()
                      ? 'text-text-tertiary'
                      : 'text-text-muted'
                  "
                >
                  {{ detail.name?.trim() || "داده ای وارد نشده است" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-text-passive">شماره تماس همراه:</p>
                <p
                  class="mt-2 font-semibold"
                  :class="
                    detail.cellphone?.trim()
                      ? 'text-text-tertiary'
                      : 'text-text-muted'
                  "
                >
                  {{ detail.cellphone?.trim() || "داده ای وارد نشده است" }}
                </p>
              </div>
            </div>
          </section>

          <section>
            <Titr>نوع فعالیت</Titr>
            <div class="mt-5">
              <p class="text-sm text-text-passive">نوع فعالیت:</p>
              <p
                class="mt-2 font-semibold"
                :class="
                  detail.activity_type?.trim()
                    ? 'text-text-tertiary'
                    : 'text-text-muted'
                "
              >
                {{ detail.activity_type?.trim() || "داده ای وارد نشده است" }}
              </p>
            </div>
            <div class="mt-5">
              <p class="text-sm text-text-passive">توضیحات:</p>
              <p
                class="mt-2 whitespace-pre-wrap text-sm leading-7 font-semibold"
                :class="
                  detail.desc?.trim() ? 'text-text-tertiary' : 'text-text-muted'
                "
              >
                {{ detail.desc?.trim() || "داده ای وارد نشده است" }}
              </p>
            </div>
          </section>

          <section>
            <Titr>موقعیت مکانی</Titr>
            <div class="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <p class="text-sm text-text-passive">استان:</p>
                <p
                  class="mt-2 font-semibold"
                  :class="
                    detail.province_name?.trim()
                      ? 'text-text-tertiary'
                      : 'text-text-muted'
                  "
                >
                  {{ detail.province_name?.trim() || "داده ای وارد نشده است" }}
                </p>
              </div>
              <div>
                <p class="text-sm text-text-passive">شهر:</p>
                <p
                  class="mt-2 font-semibold"
                  :class="
                    detail.city_name?.trim()
                      ? 'text-text-tertiary'
                      : 'text-text-muted'
                  "
                >
                  {{ detail.city_name?.trim() || "داده ای وارد نشده است" }}
                </p>
              </div>
            </div>
          </section>

          <div class="flex flex-wrap items-center justify-between gap-3">
            <TaxReturnStatusBadge :status="detail.status" />
            <p
              v-if="formattedPrice"
              class="font-yb-bold text-lg text-[#009F65]"
            >
              {{ formattedPrice }}
              <span class="text-sm font-semibold text-text-passive">تومان</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import type { ApiResponse } from "~/types/api";
import type { TaxReturnDetail } from "~/types/tax-return";
import { formatPayablePrice } from "~/utils/tax-return-payload";
import TaxReturnStatusBadge from "./TaxReturnStatusBadge.vue";

withDefaults(
  defineProps<{
    width?: number;
  }>(),
  {
    width: 640,
  },
);

const api = useApi();

const dialogRef = ref<HTMLDialogElement | null>(null);
const detail = ref<TaxReturnDetail | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const formattedPrice = computed(() => {
  const price = Number(detail.value?.payable_price);
  if (!Number.isFinite(price) || price <= 0) return null;
  return formatPayablePrice(price);
});

function getFetchErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: string }).message);
  }
  return "خطا در دریافت جزئیات درخواست";
}

async function fetchDetail(id: number) {
  const showSkeleton = !detail.value;
  if (showSkeleton) loading.value = true;
  error.value = null;

  try {
    const result = await api.get<ApiResponse<TaxReturnDetail>>(
      `/tax-returns/${id}`,
    );
    detail.value = result.data ?? null;
    if (!detail.value) {
      error.value = "جزئیات درخواست یافت نشد";
    }
  } catch (err: unknown) {
    detail.value = null;
    error.value = getFetchErrorMessage(err);
  } finally {
    loading.value = false;
  }
}

async function open(id: number) {
  error.value = null;
  dialogRef.value?.showModal();
  await fetchDetail(id);
}

function closeModal() {
  dialogRef.value?.close();
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

defineExpose({
  open,
  closeModal,
});
</script>
