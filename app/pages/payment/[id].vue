<template>
  <div
    dir="rtl"
    class="flex min-h-screen items-center justify-center bg-surface-100 px-4 py-10"
  >
    <div class="w-full max-w-120">
      <NuxtLink
        to="/"
        class="mb-8 flex items-center justify-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <NuxtImg src="/images/logo.png" alt="های‌حساب" class="h-11 w-11" />
        <div class="text-right">
          <p class="font-yb-bold text-base text-text-tertiary">های‌حساب</p>
          <p class="text-caption text-text-passive">خانه حسابداران با تجربه</p>
        </div>
      </NuxtLink>

      <div
        class="rounded-2xl border border-surface-200 bg-surface-card px-6 py-8 shadow-sm sm:px-8"
      >
        <div class="flex flex-col items-center text-center">
          <div class="relative flex items-center justify-center">
            <Icon
              :name="
                isSuccess
                  ? 'svg:success-icon-with-shadow-1'
                  : 'svg:error-icon-with-shadow-1'
              "
              size="256"
              class="text-white"
            />
          </div>

          <h1
            class="font-yb-bold text-lg sm:text-xl"
            :class="isSuccess ? 'text-success-500' : 'text-danger-500'"
          >
            {{ statusTitle }}
          </h1>
        </div>

        <dl class="mt-8 space-y-4 text-sm">
          <div class="flex items-center justify-between gap-4">
            <dt class="shrink-0 text-text-passive">مبلغ پرداختی</dt>
            <dd class="font-yb-bold text-text-tertiary">
              <template v-if="formattedPrice">
                {{ formattedPrice }}
                <span class="mr-1 font-normal text-text-passive">تومان</span>
              </template>
              <template v-else>—</template>
            </dd>
          </div>

          <div class="flex items-center justify-between gap-4">
            <dt class="shrink-0 text-text-passive">{{ statusLabel }}</dt>
            <dd>
              <span
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                :class="
                  isSuccess
                    ? 'bg-success-100 text-success-500'
                    : 'bg-danger-100 text-danger-500'
                "
              >
                {{ statusBadge }}
              </span>
            </dd>
          </div>

          <div class="flex items-center justify-between gap-4">
            <dt class="shrink-0 text-text-passive">شماره پیگیری</dt>
            <dd class="font-yb-bold tabular-nums text-text-tertiary">
              {{ formattedTrackId || "—" }}
            </dd>
          </div>

          <div class="flex items-center justify-between gap-4">
            <dt class="shrink-0 text-text-passive">زمان</dt>
            <dd class="font-yb-bold tabular-nums text-text-tertiary">
              {{ formattedTime }}
            </dd>
          </div>
        </dl>

        <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <NuxtLink
            :to="primaryAction.to"
            class="btn btn-success order-1 h-11 gap-2 rounded-lg font-yb-bold sm:order-2"
          >
            <Icon :name="primaryAction.icon" size="18" />
            <span>{{ primaryAction.label }}</span>
          </NuxtLink>
          <NuxtLink
            :to="secondaryAction.to"
            class="btn order-2 h-11 rounded-lg border-none bg-surface-100 font-yb-bold text-text-tertiary hover:bg-surface-200 sm:order-1"
          >
            {{ secondaryAction.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TAX_RETURN_PAYABLE_PRICE } from "~/types/tax-return-form";
import { formatJalaliDate } from "~/utils/format-jalali-date";
import { formatPayablePrice } from "~/utils/tax-return-payload";

definePageMeta({
  layout: false,
});

const { setForcedTheme } = useAppTheme();
setForcedTheme("light");
onUnmounted(() => {
  setForcedTheme(null);
});

type PaymentType = "TaxReturn" | "Ad" | "Project" | string;

const route = useRoute();
const query = computed(() => route.query);

const paymentType = computed<PaymentType>(() => {
  const raw = String(query.value.type ?? "");
  return raw || "TaxReturn";
});

const isSuccess = computed(() => {
  const verified = query.value.verified;
  if (verified === "0" || verified === "false") return false;
  if (verified === "1" || verified === "true") return true;

  const success = String(query.value.success ?? "");
  return success === "1" || success === "true";
});

const trackId = computed(() => {
  const value = query.value.trackId ?? query.value.track_id;
  return value != null ? String(value) : "";
});

const modelId = computed(() => {
  const value = query.value.modelId ?? query.value.model_id;
  return value != null && value !== "" ? String(value) : null;
});

const price = computed(() => {
  const raw = query.value.price;
  if (raw != null && raw !== "") {
    const parsed = Number(String(raw).replace(/,/g, ""));
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  if (paymentType.value === "TaxReturn") return TAX_RETURN_PAYABLE_PRICE;
  return null;
});

const formattedPrice = computed(() =>
  price.value != null ? formatPayablePrice(price.value) : "",
);

function toPersianDigits(value: string) {
  return value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]!);
}

const formattedTrackId = computed(() =>
  trackId.value ? toPersianDigits(trackId.value) : "",
);

const formattedTime = computed(() => {
  const now = new Date().toISOString();
  const date = formatJalaliDate(now, "jYYYY/jMM/jDD");
  const time = formatJalaliDate(now, "HH:mm");
  return toPersianDigits(`${date} - ${time}`);
});

const statusTitle = computed(() =>
  isSuccess.value ? "پرداخت شما با موفقیت انجام شد" : "پرداخت شما ناموفق بود",
);

const statusLabel = computed(() => {
  switch (paymentType.value) {
    case "Ad":
      return "وضعیت آگهی";
    case "Project":
      return "وضعیت پروژه";
    case "TaxReturn":
    default:
      return "وضعیت درخواست";
  }
});

const statusBadge = computed(() => (isSuccess.value ? "پرداخت شده" : "ناموفق"));

const primaryAction = computed(() => {
  switch (paymentType.value) {
    case "Ad":
      return {
        label: "مشاهده آگهی",
        icon: "lucide:store",
        to: modelId.value
          ? `/jobs/${modelId.value}`
          : "/dashboard/employer/ads",
      };
    case "Project":
      return {
        label: "مشاهده پروژه",
        icon: "lucide:folder",
        to: "/dashboard",
      };
    case "TaxReturn":
    default:
      return {
        label: "مشاهده درخواست",
        icon: "lucide:file-text",
        to: "/dashboard/tax-returns",
      };
  }
});

const secondaryAction = computed(() => {
  switch (paymentType.value) {
    case "Ad":
      return {
        label: "بازگشت به پنل کارفرما",
        to: "/dashboard/employer/ads",
      };
    case "Project":
      return {
        label: "بازگشت به داشبورد",
        to: "/dashboard",
      };
    case "TaxReturn":
    default:
      return {
        label: "بازگشت به داشبورد",
        to: "/dashboard",
      };
  }
});

useSeoMeta({
  title: () =>
    isSuccess.value ? "پرداخت موفق | های‌حساب" : "پرداخت ناموفق | های‌حساب",
});
</script>
