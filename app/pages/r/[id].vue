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
        <!-- Loading state -->
        <div v-if="loading" class="flex flex-col items-center py-8">
          <div
            class="h-12 w-12 animate-spin rounded-full border-4 border-surface-200 border-t-success-500"
          />
          <p class="mt-4 text-sm text-text-passive">
            در حال دریافت اطلاعات پرداخت...
          </p>
        </div>

        <!-- Error state -->
        <div
          v-else-if="errorMessage"
          class="flex flex-col items-center text-center"
        >
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-100"
          >
            <Icon
              name="lucide:alert-triangle"
              size="28"
              class="text-danger-500"
            />
          </div>
          <h1 class="font-yb-bold text-lg text-danger-500">
            خطا در دریافت اطلاعات
          </h1>
          <p class="mt-2 text-sm leading-7 text-text-passive">
            {{ errorMessage }}
          </p>
          <button
            type="button"
            class="btn btn-success mt-6 h-11 gap-2 rounded-lg px-8 font-yb-bold"
            @click="fetchPayment"
          >
            <Icon name="lucide:refresh-cw" size="16" />
            تلاش مجدد
          </button>
        </div>

        <!-- Already paid state -->
        <div
          v-else-if="alreadyPaid"
          class="flex flex-col items-center text-center"
        >
          <div
            class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100"
          >
            <Icon
              name="lucide:check-circle"
              size="28"
              class="text-success-500"
            />
          </div>
          <h1 class="font-yb-bold text-lg text-success-500">
            این پرداخت قبلاً انجام شده است
          </h1>
          <button
            type="button"
            class="btn btn-success mt-6 h-11 gap-2 rounded-lg px-8 font-yb-bold"
            @click="router.push('/dashboard')"
          >
            بازگشت به داشبورد
          </button>
        </div>

        <!-- Countdown / redirect state -->
        <template v-else>
          <div class="flex flex-col items-center text-center">
            <div
              class="relative mb-5 flex h-28 w-28 items-center justify-center"
            >
              <svg
                class="absolute inset-0 h-full w-full -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  class="stroke-surface-200"
                  stroke-width="6"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  class="stroke-success-500 transition-[stroke-dashoffset] duration-1000 ease-linear"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="progressOffset"
                />
              </svg>
              <div
                class="relative flex h-20 w-20 flex-col items-center justify-center rounded-full bg-success-100"
              >
                <span
                  class="font-yb-bold text-3xl tabular-nums text-success-500"
                >
                  {{ persianCountdown }}
                </span>
              </div>
            </div>

            <h1 class="font-yb-bold text-lg text-text-tertiary sm:text-xl">
              در حال انتقال به درگاه پرداخت
            </h1>
            <p class="mt-2 text-sm leading-7 text-text-passive">
              لطفا چند لحظه صبر کنید. به‌صورت خودکار به درگاه هدایت می‌شوید.
            </p>
          </div>

          <dl class="mt-8 space-y-4 text-sm">
            <div class="flex items-center justify-between gap-4">
              <dt class="shrink-0 text-text-passive">مبلغ قابل پرداخت</dt>
              <dd class="font-yb-bold text-text-tertiary">
                <template v-if="formattedPrice">
                  {{ formattedPrice }}
                  <span class="mr-1 font-normal text-text-passive">تومان</span>
                </template>
                <template v-else>—</template>
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4">
              <dt class="shrink-0 text-text-passive">نوع پرداخت</dt>
              <dd class="font-yb-bold text-text-tertiary">{{ typeLabel }}</dd>
            </div>

            <div class="flex items-center justify-between gap-4">
              <dt class="shrink-0 text-text-passive">درگاه</dt>
              <dd>
                <span
                  class="inline-flex items-center rounded-full bg-success-100 px-3 py-1 text-xs font-semibold text-success-500"
                >
                  {{ gatewayLabel }}
                </span>
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4">
              <dt class="shrink-0 text-text-passive">پرداخت‌کننده</dt>
              <dd class="font-yb-bold text-text-tertiary">
                {{ paymentData?.buyer_name || "—" }}
              </dd>
            </div>

            <div class="flex items-center justify-between gap-4">
              <dt class="shrink-0 text-text-passive">انتقال خودکار</dt>
              <dd class="font-yb-bold tabular-nums text-text-tertiary">
                {{ persianCountdown }} ثانیه
              </dd>
            </div>
          </dl>

          <div class="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              class="btn btn-success order-1 h-11 gap-2 rounded-lg font-yb-bold sm:order-2"
              :disabled="redirecting || paying"
              @click="goNow"
            >
              <Icon name="svg:wallet" size="18" />
              <span>{{
                redirecting
                  ? "در حال انتقال..."
                  : paying
                  ? "در حال آماده‌سازی..."
                  : "پرداخت اکنون"
              }}</span>
            </button>
            <button
              type="button"
              class="btn order-2 h-11 rounded-lg border-none bg-surface-100 font-yb-bold text-text-tertiary hover:bg-surface-200 sm:order-1"
              :disabled="redirecting || paying"
              @click="cancel"
            >
              انصراف
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPayablePrice } from "~/utils/tax-return-payload";

definePageMeta({
  layout: false,
});

const COUNTDOWN_SECONDS = 5;
const circumference = 2 * Math.PI * 44;

const { setForcedTheme } = useAppTheme();
setForcedTheme("light");
onUnmounted(() => {
  setForcedTheme(null);
});

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const client = useSanctumClient();
const paymentId = computed(() => String(route.params.id ?? ""));

type PaymentDetail = {
  id: number;
  price: number | string;
  status: number;
  transaction_id: string | null;
  ref_id: string | null;
  gateway: string;
  formatted_gateway: string;
  model_type: string;
  buyer_name: string | null;
  card_number: string | null;
  created_at: string;
};

const paymentData = ref<PaymentDetail | null>(null);
const loading = ref(true);
const errorMessage = ref("");
const countdown = ref(COUNTDOWN_SECONDS);
const redirecting = ref(false);
const paying = ref(false);
const alreadyPaid = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const baseUrl = computed(() => {
  const apiBase = config.public.apiBase as string;
  return apiBase.replace(/\/v1\/?$/, "");
});

async function fetchPayment() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await client<{ data: PaymentDetail }>(
      `/payments/${paymentId.value}`,
      { baseURL: baseUrl.value, method: "GET" },
    );
    paymentData.value = response.data;
    loading.value = false;

    if (response.data.status === 9) {
      alreadyPaid.value = true;
      return;
    }

    startCountdown();
  } catch (err: unknown) {
    loading.value = false;
    const status =
      err && typeof err === "object" && "statusCode" in err
        ? (err as { statusCode?: number }).statusCode
        : null;

    if (status === 404) {
      errorMessage.value = "پرداخت مورد نظر یافت نشد.";
    } else {
      errorMessage.value =
        "خطا در دریافت اطلاعات پرداخت. لطفا دوباره تلاش کنید.";
    }
  }
}

type PayPayload = {
  redirect_url?: string | null;
  action?: string | null;
  method?: string | null;
  ref_id?: string | null;
  RefId?: string | null;
  token?: string | null;
  payment?: PayPayload | null;
  inputs?: Record<string, string | number | null | undefined> | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function unwrapPay(response: unknown): PayPayload {
  if (!isRecord(response)) return {};

  const layers: Record<string, unknown>[] = [response];
  const data = response.data;
  if (isRecord(data)) layers.push(data);

  for (const layer of [...layers]) {
    const payment = layer.payment;
    if (isRecord(payment)) layers.push(payment);
  }

  return Object.assign({}, ...layers) as PayPayload;
}

function resolveRefId(payload: PayPayload, fallback?: string | null) {
  const candidates = [
    payload.ref_id,
    payload.RefId,
    payload.token,
    payload.inputs?.RefId,
    payload.inputs?.ref_id,
    payload.payment?.ref_id,
    payload.payment?.RefId,
    payload.payment?.inputs?.RefId,
    payload.payment?.inputs?.ref_id,
    fallback,
  ];

  for (const value of candidates) {
    const text = value == null ? "" : String(value).trim();
    if (text && !isHttpUrl(text)) return text;
  }

  return null;
}

function resolveActionUrl(payload: PayPayload) {
  const candidates = [payload.action, payload.payment?.action];
  for (const value of candidates) {
    const action = value?.trim();
    if (action && isHttpUrl(action)) return action;
  }
  return null;
}

function postGatewayForm(
  action: string,
  inputs: Record<string, string | number | null | undefined>,
) {
  if (!import.meta.client) return;

  const form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", action);
  form.setAttribute("target", "_self");

  for (const [name, value] of Object.entries(inputs)) {
    if (value == null || value === "") continue;
    const hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", name);
    hiddenField.setAttribute("value", String(value));
    form.appendChild(hiddenField);
  }

  document.body.appendChild(form);
  console.log("form submited")
  form.submit();
}

async function initiatePayment(): Promise<PayPayload | null> {
  paying.value = true;
  try {
    const response = await client<PayPayload | { data: PayPayload }>(
      `/payments/${paymentId.value}/pay`,
      { baseURL: baseUrl.value, method: "GET" },
    );
    return unwrapPay(response);
  } catch {
    errorMessage.value = "خطا در اتصال به درگاه پرداخت. لطفا دوباره تلاش کنید.";
    return null;
  } finally {
    paying.value = false;
  }
}

const price = computed(() => {
  if (!paymentData.value) return null;
  const raw = Number(paymentData.value.price);
  return Number.isFinite(raw) && raw > 0 ? raw : null;
});

const formattedPrice = computed(() =>
  price.value != null ? formatPayablePrice(price.value) : "",
);

const typeLabel = computed(() => {
  const raw = paymentData.value?.model_type;
  if (typeof raw === "string") {
    if (raw === "آگهی" || raw === "Ad") return "پرداخت آگهی";
    if (raw === "اظهارنامه" || raw === "TaxReturn") return "پرداخت اظهارنامه";
    if (raw === "پروژه" || raw === "Project") return "پرداخت پروژه";
    return raw;
  }
  return "پرداخت";
});

const gatewayLabel = computed(() => {
  const raw = String(paymentData.value?.gateway || "zibal").toLowerCase();
  if (raw.includes("zibal")) return "زیبال";
  if (raw.includes("zarin")) return "زرین‌پال";
  return paymentData.value?.formatted_gateway || "درگاه بانکی";
});

function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]!);
}

const persianCountdown = computed(() => toPersianDigits(countdown.value));

const progressOffset = computed(() => {
  const progress = countdown.value / COUNTDOWN_SECONDS;
  return circumference * (1 - progress);
});

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

async function goNow() {
  if (redirecting.value || paying.value || alreadyPaid.value) return;

  clearTimer();
  const payload = await initiatePayment();
  if (!payload) return;

  const refId = resolveRefId(payload, paymentData.value?.ref_id);
  const action = resolveActionUrl(payload);
  const inputs = payload.inputs ?? payload.payment?.inputs ?? null;

  if (action && inputs && Object.keys(inputs).length) {
    if (paymentData.value && refId) paymentData.value.ref_id = refId;
    redirecting.value = true;
    postGatewayForm(action, inputs);
    return;
  }

  if (refId && action) {
    if (paymentData.value) paymentData.value.ref_id = refId;
    redirecting.value = true;
    postGatewayForm(action, { RefId: refId });
    return;
  }

  const url = payload.redirect_url?.trim();
  if (url && isHttpUrl(url)) {
    redirecting.value = true;
    window.location.href = url;
    return;
  }

  errorMessage.value =
    "اطلاعات درگاه پرداخت ناقص است. لطفا دوباره تلاش کنید.";
}

function cancel() {
  clearTimer();
  router.push("/dashboard");
}

function startCountdown() {
  clearTimer();
  countdown.value = COUNTDOWN_SECONDS;

  timer = setInterval(() => {
    if (countdown.value <= 1) {
      clearTimer();
      countdown.value = 0;
      goNow();
      return;
    }
    countdown.value -= 1;
  }, 1000);
}

onMounted(() => {
  fetchPayment();
});

onUnmounted(() => {
  clearTimer();
  setForcedTheme(null);
});

useSeoMeta({
  title: "انتقال به درگاه پرداخت | های‌حساب",
});
</script>
