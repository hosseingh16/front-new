<template>
  <div
    class="mt-1.5 flex items-center justify-center gap-2"
    dir="ltr"
    role="group"
    aria-label="کد تایید"
    @paste.prevent="onPaste"
  >
    <div
      v-for="(_, index) in otpLength"
      :key="index"
      class="otp-cell relative"
      :class="{ 'is-filled': Boolean(model[index]) }"
    >
      <input
        ref="inputs"
        type="text"
        inputmode="numeric"
        pattern="[0-9]*"
        autocapitalize="off"
        autocorrect="off"
        spellcheck="false"
        :autocomplete="index === 0 ? 'one-time-code' : 'off'"
        :name="index === 0 ? 'one-time-code' : undefined"
        :maxlength="index === 0 ? otpLength : 1"
        class="otp-digit input w-12 h-12 border-gray-default text-gray-700 select-none text-2xl font-semibold leading-none outline-none focus:outline-none focus:shadow-none"
        :aria-label="`رقم ${index + 1}`"
        :value="model[index] ?? ''"
        @keydown="onKeydown($event, index)"
        @beforeinput="onBeforeInput($event, index)"
        @input="onInput($event, index)"
        @change="onInput($event, index)"
        @focus="onFocus"
        @selectstart.prevent
        @dblclick.prevent
      />
      <span class="otp-caret" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  createEmptyOtpDigits,
  otpCompletePattern,
} from '~/configs/settings-defaults'
import { toEnglishDigits } from '~/utils/digits'

/** Chrome Android Web OTP API (not in all TS DOM libs). */
interface OtpCredential extends Credential {
  code: string
}

interface OtpCredentialRequestOptions extends CredentialRequestOptions {
  otp?: { transport: Array<'sms'> }
}

const { otpLength } = useSettings()

const model = defineModel<string[]>({
  default: () => createEmptyOtpDigits(),
})

const emit = defineEmits<{
  (e: "complete", otp: string): void
}>()

const inputs = ref<HTMLInputElement[]>([])
let submitting = false
let lastEmitted = ""
/** Skip the input event that follows a digit we already applied in keydown. */
let skipInput = false
let otpAbort: AbortController | null = null
let otpPending = false

watch(otpLength, (length) => {
  if (model.value.length === length) return
  model.value = Array.from({ length }, (_, i) => model.value[i] ?? "")
})

watch(
  () => model.value.join(""),
  (otp, previous) => {
    if (!otpCompletePattern(otpLength.value).test(otp)) {
      lastEmitted = ""
    }
    // After a filled code is cleared (resend / retry), listen for the next SMS.
    if (previous && model.value.every((digit) => !digit)) {
      listenForSmsOtp()
    }
  },
)

function digitsOf(value: string) {
  return toEnglishDigits(value).replace(/\D/g, "")
}

function currentOtp() {
  return Array.from(
    { length: otpLength.value },
    (_, i) => model.value[i] ?? "",
  )
}

function focusAt(index: number) {
  const el = inputs.value[Math.max(0, Math.min(index, otpLength.value - 1))]
  el?.focus()
}

function emitIfComplete(otp: string) {
  if (!otpCompletePattern(otpLength.value).test(otp)) return
  if (submitting || otp === lastEmitted) return
  submitting = true
  lastEmitted = otp
  emit("complete", otp)
  queueMicrotask(() => {
    submitting = false
  })
}

function applyDigits(text: string, startIndex = 0) {
  const cleaned = digitsOf(text)
  if (!cleaned) return

  // A full (or longer) code from SMS autofill / paste always fills from the first box.
  const from = cleaned.length >= otpLength.value ? 0 : startIndex
  const slice = cleaned.slice(0, otpLength.value - from)
  if (!slice) return

  const next = currentOtp()
  for (let i = 0; i < slice.length; i++) {
    next[from + i] = slice[i]!
  }
  model.value = next

  const isComplete = otpCompletePattern(otpLength.value).test(next.join(""))
  const focusIndex = isComplete
    ? otpLength.value - 1
    : Math.min(from + slice.length, otpLength.value - 1)
  nextTick(() => focusAt(focusIndex))

  emitIfComplete(next.join(""))
}

function setDigit(index: number, digit: string) {
  const next = currentOtp()
  next[index] = digit
  model.value = next

  if (digit && index < otpLength.value - 1) {
    nextTick(() => focusAt(index + 1))
  }

  emitIfComplete(next.join(""))
}

function clearDigit(index: number) {
  const next = currentOtp()
  next[index] = ""
  model.value = next
}

function onFocus(event: FocusEvent) {
  const el = event.target as HTMLInputElement
  requestAnimationFrame(() => {
    const end = el.value.length
    el.setSelectionRange(end, end)
  })
}

function onKeydown(event: KeyboardEvent, index: number) {
  const key = event.key

  if (key === "Backspace") {
    event.preventDefault()
    if (model.value[index]) {
      clearDigit(index)
      return
    }
    if (index > 0) {
      clearDigit(index - 1)
      focusAt(index - 1)
    }
    return
  }

  if (key === "Delete") {
    event.preventDefault()
    clearDigit(index)
    return
  }

  if (key === "ArrowLeft") {
    event.preventDefault()
    if (index > 0) focusAt(index - 1)
    return
  }

  if (key === "ArrowRight") {
    event.preventDefault()
    if (index < otpLength.value - 1) focusAt(index + 1)
    return
  }

  if (key === "Enter") {
    event.preventDefault()
    emitIfComplete(currentOtp().join(""))
    return
  }

  if (key === "Tab" || event.ctrlKey || event.metaKey || event.altKey) {
    return
  }

  // Android IMEs often send Unidentified / isComposing; let input handle those.
  if (key === "Unidentified" || event.isComposing) {
    return
  }

  const digit = toEnglishDigits(key)
  if (/^\d$/.test(digit)) {
    event.preventDefault()
    skipInput = true
    setDigit(index, digit)
    queueMicrotask(() => {
      skipInput = false
    })
    return
  }

  if (key.length === 1) {
    event.preventDefault()
  }
}

/**
 * Autofill and paste often insert the whole code in one shot (insertReplacementText
 * / insertFromPaste) before an input event. Take the inserted digits here so the
 * first box never briefly holds "12345".
 */
function onBeforeInput(event: InputEvent, index: number) {
  if (skipInput || event.isComposing) return
  const digits = digitsOf(event.data ?? "")
  if (digits.length > 1) {
    event.preventDefault()
    applyDigits(digits, index)
  }
}

/**
 * Mobile keyboards, SMS autofill, and some paste paths never fire a digit keydown.
 * Treat the field value as source of truth in those cases.
 */
function onInput(event: Event, index: number) {
  const target = event.target as HTMLInputElement

  if (skipInput) {
    const expected = model.value[index] ?? ""
    if (target.value !== expected) target.value = expected
    return
  }

  const raw = digitsOf(target.value)

  if (!raw) {
    if (model.value[index]) clearDigit(index)
    else target.value = ""
    return
  }

  if (raw.length > 1) {
    applyDigits(raw, index)
    return
  }

  if (raw !== (model.value[index] ?? "")) {
    setDigit(index, raw)
    return
  }

  if (target.value !== raw) target.value = raw
}

function onPaste(event: ClipboardEvent) {
  applyDigits(event.clipboardData?.getData("text") ?? "", 0)
}

async function listenForSmsOtp() {
  if (!import.meta.client) return
  if (!("OTPCredential" in window) || !navigator.credentials?.get) return
  if (otpPending) return

  otpAbort = new AbortController()
  otpPending = true

  try {
    const credential = (await navigator.credentials.get({
      otp: { transport: ["sms"] },
      signal: otpAbort.signal,
    } as OtpCredentialRequestOptions)) as OtpCredential | null

    if (credential?.code) {
      applyDigits(credential.code, 0)
    }
  } catch {
    // Unsupported, aborted, or user dismissed the SMS OTP prompt.
  } finally {
    otpPending = false
  }
}

onMounted(() => {
  nextTick(() => focusAt(0))
  listenForSmsOtp()
})

onUnmounted(() => {
  otpAbort?.abort()
  otpAbort = null
})
</script>

<style scoped>
.otp-digit {
  font-size: 1.5rem;
  padding: 0.5rem;
  text-align: center;
  border-radius: 0.5rem;
  color: var(--color-gray-700);
  user-select: none;
  -webkit-user-select: none;
  caret-color: transparent;
}
.otp-digit:focus,
.otp-digit:focus-within {
  outline: none;
  box-shadow: none;
  isolation: auto;
  --input-color: var(--color-gray-default, var(--color-gray-300));
}
.otp-digit::selection {
  background: transparent;
  color: inherit;
}
.otp-caret {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1.5px;
  height: 1rem;
  border-radius: 1px;
  background: var(--color-gray-700);
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}
.otp-cell:focus-within:not(.is-filled) .otp-caret {
  animation: otp-caret-blink 1s step-end infinite;
}
@keyframes otp-caret-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
