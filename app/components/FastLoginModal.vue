<template>
  <dialog ref="dialogRef" class="modal" @click="onBackdropClick">
    <div class="modal-box w-full max-w-105 rounded-2xl p-6">
      <div class="flex items-start justify-between gap-3">
        <h2 class="font-yb-bold text-base leading-7 text-text-primay">
          {{ stepTitle }}
        </h2>
        <button
          type="button"
          class="shrink-0 cursor-pointer text-text-passive"
          aria-label="بستن"
          @click="closeModal"
        >
          <icons-close color="#667085" class="h-7 w-7" />
        </button>
      </div>

      <!-- Step 1: phone -->
      <form v-if="step === 'phone'" class="mt-6" @submit="onSubmitPhone">
        <m-form-input
          name="mobile"
          placeholder="شماره تلفن همراه را وارد کنید"
          english-digits
        >
          <template #prefix>
            <Icon name="svg:mobile" />
          </template>
        </m-form-input>

        <div class="mt-3 flex items-start gap-1 text-sm leading-6 text-text-passive">
          <Icon name="svg:hint" class="mt-0.5 shrink-0" />
          <p>
            با ورود یا ثبت نام در های‌حساب،
            <NuxtLink to="/terms" class="text-primary-500" target="_blank">
              شرایط و قوانین
            </NuxtLink>
            را می‌پذیرم.
          </p>
        </div>

        <button
          type="submit"
          class="btn mt-4 flex h-11 w-full justify-center gap-2"
          :class="phoneValid && !authLoading ? 'btn-primary' : 'btn-disabled'"
          :disabled="!phoneValid || authLoading"
        >
          <span v-if="authLoading" class="loading loading-spinner loading-sm" />
          <Icon v-else name="svg:user-1" size="24" />
          <span>ورود یا ثبت نام</span>
        </button>
      </form>

      <!-- Step 2: OTP -->
      <div v-else class="mt-6">
        <p class="text-sm text-text-passive">
          تایید شماره همراه :
          <button
            type="button"
            class="text-primary-500 underline underline-offset-4"
            @click="goBackToPhone"
          >
            {{ displayMobile }}
          </button>
        </p>

        <form class="mt-4" @submit.prevent="onSubmitOtp()">
          <OtpInput v-model="otpDigits" @complete="onSubmitOtp" />

          <div class="mt-3 flex flex-col items-end gap-2">
            <button
              v-if="canResend"
              type="button"
              class="btn btn-info btn-soft h-8 gap-1 px-3 text-primary-500"
              :disabled="authLoading"
              @click="onResend"
            >
              <span v-if="authLoading" class="loading loading-spinner loading-xs" />
              <Icon v-else name="svg:refresh" />
              <span class="text-sm">ارسال مجدد کد</span>
            </button>
            <div
              v-else
              class="inline-flex min-h-8 items-center gap-1 rounded-lg bg-[rgba(227,243,255,1)] px-3 py-1 text-sm leading-6 text-primary-500"
              aria-live="polite"
            >
              <Icon name="svg:refresh" class="shrink-0" />
              <span>ارسال مجدد تا {{ persianRemaining }} ثانیه دیگر</span>
            </div>

            <button
              type="button"
              class="btn btn-ghost h-8 px-2"
              :class="
                isVoiceInactive
                  ? 'cursor-not-allowed text-text-passive opacity-60'
                  : 'text-primary-500'
              "
              :disabled="isVoiceInactive"
              @click="onVoice"
            >
              <Icon name="svg:mobile" :class="isVoiceInactive ? 'opacity-50' : 'opacity-70'" />
              <span class="text-sm">{{ voiceLabel }}</span>
            </button>
          </div>

          <button
            type="submit"
            class="btn mt-4 flex h-11 w-full justify-center gap-2"
            :class="otpReady && !busy ? 'btn-primary' : 'btn-disabled'"
            :disabled="!otpReady || busy"
          >
            <span v-if="busy" class="loading loading-spinner loading-sm" />
            <template v-else>
              <Icon v-if="!otpReady" name="svg:user-1" size="24" />
              <Icon v-else name="svg:user-plus-white" size="24" />
            </template>
            <span>ورود یا ثبت نام</span>
          </button>
        </form>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as Yup from 'yup'
import OtpInput from '~/features/account/components/OtpInput.vue'
import { toPersianDigits } from '~/composables/useCountUp'
import {
  createEmptyOtpDigits,
  otpCompletePattern,
} from '~/configs/settings-defaults'
import { iranMobileSchema } from '~/utils/iran-mobile'
import {
  isResumeBasicInfoComplete,
  isResumeBasicInfoRequiredError,
} from '~/utils/api-error'

const props = withDefaults(
  defineProps<{
    adId?: string | number
  }>(),
  {
    adId: '',
  },
)

const emit = defineEmits<{
  (e: 'applied'): void
  /** Login/OTP succeeded but apply failed — parent should still update UI. */
  (e: 'apply-failed'): void
  /** Logged in, but the user has no complete resume to send. */
  (e: 'resume-incomplete'): void
}>()

const { otpLength, otpVoiceDelaySeconds } = useSettings()

const dialogRef = ref<HTMLDialogElement | null>(null)
const step = ref<'phone' | 'otp'>('phone')
const otpDigits = ref(createEmptyOtpDigits())
const applying = ref(false)

// Driven by what the server reported on the last OTP response, so closing and
// reopening the modal mid-cooldown resumes the real countdown. A rate-limited
// send only stretches this countdown; saying so is left to the toast.
const { resendRemaining, canResend, sinceSent } = useOtpCountdown()

const {
  mobile,
  loading: authLoading,
  requestOtp,
  requestOtpViaVoice,
  verifyOtp,
  loginWithMobile,
  voiceSent,
  reset: resetAuth,
} = useAccountAuth()

const { applyToAd, loading: applyLoading } = useApplyToAd()
const { user } = useCurrentUser()
const { ensureRoleForAction } = useRoleGate()

const phoneSchema = Yup.object({
  mobile: iranMobileSchema(),
})

const { handleSubmit, meta, setValues, resetForm } = useForm<
  Yup.InferType<typeof phoneSchema>
>({
  validationSchema: phoneSchema,
})

const phoneValid = computed(() => meta.value.valid)
const otpReady = computed(() => otpDigits.value.every((d) => d !== ''))
const busy = computed(() => authLoading.value || applying.value || applyLoading.value)
const voiceRemaining = computed(() =>
  sinceSent.value === null
    ? otpVoiceDelaySeconds.value
    : Math.max(0, otpVoiceDelaySeconds.value - sinceSent.value),
)
// Nothing sent yet means there is no code to read out over the phone.
const voiceAvailable = computed(
  () => sinceSent.value !== null && voiceRemaining.value <= 0,
)

const displayMobile = computed(() => {
  const phone = mobile.value || ''
  return phone.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)] ?? d)
})

const persianRemaining = computed(() => toPersianDigits(resendRemaining.value))
const persianVoiceRemaining = computed(() => toPersianDigits(voiceRemaining.value))
const voiceLabel = computed(() => {
  if (voiceSent.value) return 'تماس صوتی ارسال شد'
  if (!voiceAvailable.value) {
    return `دریافت کد با تماس تا ${persianVoiceRemaining.value} ثانیه دیگر`
  }
  return 'دریافت کد با تماس'
})
const isVoiceInactive = computed(
  () => authLoading.value || voiceSent.value || !voiceAvailable.value,
)

const stepTitle = computed(() =>
  step.value === 'phone'
    ? 'برای ارسال درخواست شغلی، شماره موبایل خود را وارد کنید'
    : 'برای ادامه، شماره موبایل خود را تایید کنید',
)

function emptyOtp() {
  return createEmptyOtpDigits(otpLength.value)
}

function isCompleteOtp(value: string) {
  return otpCompletePattern(otpLength.value).test(value)
}

function resetLocalState() {
  step.value = 'phone'
  otpDigits.value = emptyOtp()
  applying.value = false
  resetForm()
}

function showModal() {
  resetLocalState()
  dialogRef.value?.showModal()
}

function closeModal() {
  dialogRef.value?.close()
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

function goBackToPhone() {
  step.value = 'phone'
  otpDigits.value = emptyOtp()
  if (mobile.value) setValues({ mobile: mobile.value })
}

const onSubmitPhone = handleSubmit(async (data) => {
  await requestOtp(data.mobile)
  step.value = 'otp'
  otpDigits.value = emptyOtp()
})

async function onResend() {
  if (!canResend.value || !mobile.value) return
  otpDigits.value = emptyOtp()
  await requestOtp(mobile.value)
}

async function onVoice() {
  await requestOtpViaVoice()
}

async function onSubmitOtp(otpFromEvent?: string | Event) {
  if (busy.value) return

  const otp =
    typeof otpFromEvent === 'string' && isCompleteOtp(otpFromEvent)
      ? otpFromEvent
      : otpDigits.value.join('')

  if (!isCompleteOtp(otp)) return

  if (typeof otpFromEvent === 'string') {
    otpDigits.value = otp.split('')
  }

  applying.value = true
  try {
    await verifyOtp(otp)
    await loginWithMobile(undefined, false)

    let applySucceeded = true
    let resumeIncomplete = false
    if (props.adId) {
      try {
        const assigned = await ensureRoleForAction('job_seeker')
        if (!assigned) {
          applySucceeded = false
        } else if (!isResumeBasicInfoComplete(user.value)) {
          applySucceeded = false
          resumeIncomplete = true
        } else {
          await applyToAd(props.adId)
        }
      } catch (err) {
        applySucceeded = false
        resumeIncomplete = isResumeBasicInfoRequiredError(err)
      }
    }

    closeModal()
    resetAuth()
    resetLocalState()

    if (applySucceeded) {
      emit('applied')
    } else if (resumeIncomplete) {
      emit('resume-incomplete')
    } else {
      emit('apply-failed')
    }
  } catch {
    // OTP / login errors toasted in composables — keep modal open
  } finally {
    applying.value = false
  }
}

defineExpose({
  showModal,
  closeModal,
})
</script>
