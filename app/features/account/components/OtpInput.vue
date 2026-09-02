<template>
  <div
    class="mt-2 flex items-center justify-center gap-2 [&>.input]:rounded-lg [&>.input]:border-gray-default [&>.input]:text-center [&>.input]:px-0"
    dir="ltr"
    @paste.prevent="onPaste"
  >
    <input
      v-for="(_, index) in otpLength"
      :key="index"
      ref="inputs"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      class="input w-10 h-10"
      :aria-label="`رقم ${index + 1}`"
      :value="model[index] ?? ''"
      @keydown="onKeydown($event, index)"
      @input="onInput($event, index)"
    />
  </div>
</template>

<script setup lang="ts">
import {
  createEmptyOtpDigits,
  otpCompletePattern,
} from '~/configs/settings-defaults'

const { otpLength } = useSettings()

const model = defineModel<string[]>({
  default: () => createEmptyOtpDigits(),
})

const emit = defineEmits<{
  (e: "complete", otp: string): void
}>()

const inputs = ref<HTMLInputElement[]>([])
let submitting = false

watch(otpLength, (length) => {
  if (model.value.length === length) return
  model.value = Array.from({ length }, (_, i) => model.value[i] ?? "")
})

function digitsOf(value: string) {
  return value.replace(/\D/g, "")
}

function focusAt(index: number) {
  const el = inputs.value[Math.max(0, Math.min(index, otpLength.value - 1))]
  el?.focus()
}

function setDigit(index: number, digit: string) {
  const next = Array.from(
    { length: otpLength.value },
    (_, i) => model.value[i] ?? "",
  )
  next[index] = digit
  model.value = next

  if (digit && index < otpLength.value - 1) {
    nextTick(() => focusAt(index + 1))
  }

  if (next.every(Boolean) && !submitting) {
    submitting = true
    emit("complete", next.join(""))
    queueMicrotask(() => {
      submitting = false
    })
  }
}

function clearDigit(index: number) {
  const next = Array.from(
    { length: otpLength.value },
    (_, i) => model.value[i] ?? "",
  )
  next[index] = ""
  model.value = next
}

/** Primary path: handle digit keys before the browser inserts (avoids maxlength/replace bugs). */
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
    const otp = Array.from(
      { length: otpLength.value },
      (_, i) => model.value[i] ?? "",
    ).join("")
    if (otpCompletePattern(otpLength.value).test(otp) && !submitting) {
      submitting = true
      emit("complete", otp)
      queueMicrotask(() => {
        submitting = false
      })
    }
    return
  }

  if (key === "Tab" || event.ctrlKey || event.metaKey || event.altKey) {
    return
  }

  // Single digit — set immediately and move forward (one keystroke)
  if (/^\d$/.test(key)) {
    event.preventDefault()
    setDigit(index, key)
  }
}

/** Fallback for mobile autofill / composition / paste-into-field. */
function onInput(event: Event, index: number) {
  const target = event.target as HTMLInputElement
  const raw = digitsOf(target.value)

  if (raw.length > 1) {
    applyDigits(raw, index)
    return
  }

  // If keydown already handled the digit, keep DOM in sync with model
  const expected = model.value[index] ?? ""
  if (target.value !== expected) {
    target.value = expected
  }
}

function applyDigits(text: string, startIndex = 0) {
  const cleaned = digitsOf(text).slice(0, otpLength.value - startIndex)
  if (!cleaned) return

  const next = Array.from(
    { length: otpLength.value },
    (_, i) => model.value[i] ?? "",
  )
  for (let i = 0; i < cleaned.length; i++) {
    next[startIndex + i] = cleaned[i]!
  }
  model.value = next

  const focusIndex = Math.min(startIndex + cleaned.length, otpLength.value - 1)
  nextTick(() => focusAt(focusIndex))

  if (next.every(Boolean) && !submitting) {
    submitting = true
    emit("complete", next.join(""))
    queueMicrotask(() => {
      submitting = false
    })
  }
}

function onPaste(event: ClipboardEvent) {
  applyDigits(event.clipboardData?.getData("text") ?? "", 0)
}

onMounted(() => {
  nextTick(() => focusAt(0))
})
</script>
