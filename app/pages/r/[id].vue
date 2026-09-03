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

type GatewayInputs = Record<string, string | number | boolean | null | undefined>

type PayPayload = {
  redirect_url?: string | null
  action?: string | null
  method?: string | null
  ref_id?: string | null
  RefId?: string | null
  Token?: string | null
  token?: string | null
  GetMethod?: string | boolean | null
  payment?: PayPayload | null
  inputs?: GatewayInputs | string | null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === 'object' && !Array.isArray(value)
}

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value)
}

function normalizeInputs(value: unknown): GatewayInputs {
  if (typeof value === 'string') {
    try {
      return normalizeInputs(JSON.parse(value))
    } catch {
      return {}
    }
  }

  if (!isRecord(value)) return {}

  const inputs: GatewayInputs = {}
  for (const [key, entry] of Object.entries(value)) {
    if (entry == null) continue
    if (
      typeof entry === 'string' ||
      typeof entry === 'number' ||
      typeof entry === 'boolean'
    ) {
      inputs[key] = entry
    }
  }
  return inputs
}

function collectPayNodes(response: unknown): Record<string, unknown>[] {
  if (!isRecord(response)) return []

  const nodes: Record<string, unknown>[] = []
  const queue: unknown[] = [response]
  const seen = new Set<unknown>()

  while (queue.length) {
    const current = queue.shift()
    if (!isRecord(current) || seen.has(current)) continue
    seen.add(current)
    nodes.push(current)

    for (const value of Object.values(current)) {
      if (isRecord(value)) queue.push(value)
    }
  }

  return nodes
}

function resolveGateway(
  response: unknown,
  options: {
    fallbackRefId?: string | null
    gateway?: string | null
  } = {},
): {
  action: string | null
  inputs: GatewayInputs
  redirectUrl: string | null
  method: string
} {
  const nodes = collectPayNodes(response)

  let action: string | null = null
  let redirectUrl: string | null = null
  let gatewayName = String(options.gateway ?? '').toLowerCase()
  let inputs: GatewayInputs = {}

  for (const node of nodes) {
    if (!action) {
      const candidate = node.action
      if (typeof candidate === 'string' && isHttpUrl(candidate.trim())) {
        action = candidate.trim()
      }
    }

    if (!redirectUrl) {
      const candidate = node.redirect_url
      if (typeof candidate === 'string' && isHttpUrl(candidate.trim())) {
        redirectUrl = candidate.trim()
      }
    }

    if (!gatewayName) {
      const candidate = node.gateway ?? node.formatted_gateway
      if (typeof candidate === 'string' && candidate.trim()) {
        gatewayName = candidate.trim().toLowerCase()
      }
    }

    const nestedInputs = normalizeInputs(node.inputs)
    if (Object.keys(nestedInputs).length) {
      inputs = { ...inputs, ...nestedInputs }
    }

    for (const key of ['RefId', 'ref_id'] as const) {
      const value = node[key]
      if (
        (typeof value === 'string' || typeof value === 'number') &&
        String(value).trim() &&
        !isHttpUrl(String(value).trim())
      ) {
        inputs.RefId = value
      }
    }

    for (const key of ['Token', 'token'] as const) {
      const value = node[key]
      if (
        (typeof value === 'string' || typeof value === 'number') &&
        String(value).trim() &&
        !isHttpUrl(String(value).trim())
      ) {
        inputs.Token = value
      }
    }

    if ('GetMethod' in node && inputs.GetMethod === undefined) {
      const value = node.GetMethod
      if (
        value == null ||
        typeof value === 'string' ||
        typeof value === 'boolean' ||
        typeof value === 'number'
      ) {
        inputs.GetMethod = value as string | number | boolean | null
      }
    }
  }

  const fallbackToken = options.fallbackRefId?.trim()
  if (fallbackToken) {
    if (!inputs.RefId) inputs.RefId = fallbackToken
    if (!inputs.Token) inputs.Token = fallbackToken
  }

  const token =
    inputs.Token ?? inputs.token ?? inputs.RefId ?? inputs.ref_id ?? null

  if (gatewayName.includes('sep') || gatewayName.includes('saman')) {
    inputs = {
      Token: token,
      GetMethod: inputs.GetMethod ?? '',
    }
  } else if (
    gatewayName.includes('behpardakht') ||
    gatewayName.includes('mellat')
  ) {
    inputs = { RefId: token }
  }

  let method = 'POST'
  for (const node of nodes) {
    const candidate = node.method
    if (typeof candidate === 'string' && candidate.trim()) {
      method = candidate.trim().toUpperCase()
      break
    }
  }

  return { action, inputs, redirectUrl, method }
}

function hasGatewayToken(inputs: GatewayInputs) {
  const token = inputs.RefId ?? inputs.Token ?? inputs.ref_id ?? inputs.token
  return token != null && String(token).trim() !== ''
}

function postGatewayForm(
  action: string,
  method: string,
  inputs: GatewayInputs,
) {
  if (!import.meta.client) return

  const form = document.createElement('form')
  form.setAttribute('method', method.toUpperCase() === 'GET' ? 'GET' : 'POST')
  form.setAttribute('action', action)
  form.setAttribute('target', '_self')
  form.setAttribute('name', 'forms')

  for (const [name, value] of Object.entries(inputs)) {
    if (value == null && name !== 'GetMethod') continue
    const hiddenField = document.createElement('input')
    hiddenField.setAttribute('type', 'hidden')
    hiddenField.setAttribute('name', name)
    hiddenField.setAttribute('value', value == null ? '' : String(value))
    form.appendChild(hiddenField)
  }

  document.body.appendChild(form)
  form.submit()
}

async function initiatePayment(): Promise<unknown | null> {
  paying.value = true
  try {
    return await client(`/payments/${paymentId.value}/pay`, {
      baseURL: baseUrl.value,
      method: 'GET',
    })
  } catch {
    errorMessage.value = 'خطا در اتصال به درگاه پرداخت. لطفا دوباره تلاش کنید.'
    return null
  } finally {
    paying.value = false
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
  const raw = String(paymentData.value?.gateway || '').toLowerCase()
  if (raw.includes('zibal')) return 'زیبال'
  if (raw.includes('zarin')) return 'زرین‌پال'
  if (raw.includes('mellat') || raw.includes('behpardakht')) return 'ملت'
  if (raw.includes('sep') || raw.includes('saman')) return 'سپ'
  return paymentData.value?.formatted_gateway || 'درگاه بانکی'
})

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
  if (redirecting.value || paying.value || alreadyPaid.value) return

  clearTimer()
  const response = await initiatePayment()
  if (!response) return

  const { action, inputs, redirectUrl, method } = resolveGateway(response, {
    fallbackRefId: paymentData.value?.ref_id,
    gateway: paymentData.value?.gateway,
  })

  if (action && hasGatewayToken(inputs)) {
    const token =
      inputs.RefId ?? inputs.Token ?? inputs.ref_id ?? inputs.token ?? null
    if (paymentData.value && token != null) {
      paymentData.value.ref_id = String(token)
    }

    redirecting.value = true
    postGatewayForm(action, method, inputs)
    return
  }

  if (redirectUrl) {
    redirecting.value = true
    window.location.href = redirectUrl
    return
  }

  errorMessage.value =
    'اطلاعات درگاه پرداخت ناقص است. لطفا دوباره تلاش کنید.'
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
