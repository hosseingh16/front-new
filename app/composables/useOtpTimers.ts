/** Why the resend button is currently unavailable. */
export type OtpResendBlock = 'cooldown' | 'rate_limit'

export interface OtpRejection {
  block: OtpResendBlock
  seconds: number
  /** Present only on a cooldown rejection, which names the live code. */
  requestId?: string
}

interface OtpDeliveryFields {
  remaining_seconds?: number
  expires_in?: number
}

/** mm:ss, the form the OTP screens already use for their countdowns. */
export function formatOtpClock(seconds: number) {
  const m = Math.floor(Math.max(0, seconds) / 60)
  const s = Math.max(0, seconds) % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/**
 * Toast copy for a rate-limited send. The form itself only ever shows the
 * countdown, so this is the one place the cap is spelled out.
 */
export function otpRateLimitMessage(seconds: number) {
  return `تعداد درخواست‌ها بیش از حد مجاز است، ادامه روند ورود یا ثبت نام تا ${formatOtpClock(seconds)} دیگر امکان پذیر نیست`
}

function readSeconds(value: unknown): number | null {
  const seconds = typeof value === 'string' ? Number(value) : value
  return typeof seconds === 'number' && Number.isFinite(seconds) && seconds >= 0
    ? seconds
    : null
}

function secondsUntil(deadline: number, now: number) {
  return deadline > 0 ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0
}

/**
 * Deadlines for the active OTP, held as absolute timestamps.
 *
 * Every OTP response reports remaining_seconds and expires_in, including the
 * 429s, so the server is the only source of truth here. Keeping the resulting
 * deadlines in shared state lets the countdowns stay honest across remounts and
 * step changes, which a per-component counter seeded from a constant cannot do.
 */
export function useOtpTimers() {
  const sentAt = useState('account.otp.sentAt', () => 0)
  const resendAvailableAt = useState('account.otp.resendAvailableAt', () => 0)
  const expiresAt = useState('account.otp.expiresAt', () => 0)

  /** Records a code that was just delivered. */
  function applyDelivery(payload: OtpDeliveryFields, delivered = true) {
    const now = Date.now()

    if (delivered) sentAt.value = now

    const remaining = readSeconds(payload.remaining_seconds)
    if (remaining !== null) resendAvailableAt.value = now + remaining * 1000

    const expiresIn = readSeconds(payload.expires_in)
    if (expiresIn !== null) expiresAt.value = now + expiresIn * 1000
  }

  /**
   * Records a rejected send so the UI can count down to the real retry moment
   * instead of guessing. The cooldown response carries expires_in because the
   * code is still alive; the rate-limit one does not, which is how the two are
   * told apart — the caller needs them apart to word its toast.
   *
   * The cooldown response also names the code it refused to replace, which is
   * passed back so a caller that has lost its request_id can pick the flow up
   * again.
   *
   * Returns null when the payload held no usable timing.
   */
  function applyRejection(
    payload: Record<string, unknown> | null,
  ): OtpRejection | null {
    const retryAfter =
      readSeconds(payload?.retry_after) ?? readSeconds(payload?.remaining_seconds)

    if (retryAfter === null) return null

    const now = Date.now()
    resendAvailableAt.value = now + retryAfter * 1000

    const expiresIn = readSeconds(payload?.expires_in)
    let block: OtpResendBlock = 'rate_limit'

    if (expiresIn !== null) {
      expiresAt.value = now + expiresIn * 1000
      block = 'cooldown'
    }

    return {
      block,
      seconds: retryAfter,
      requestId:
        typeof payload?.request_id === 'string' && payload.request_id !== ''
          ? payload.request_id
          : undefined,
    }
  }

  /** Called once a code is consumed or the flow is abandoned. */
  function clearOtpTimers() {
    sentAt.value = 0
    resendAvailableAt.value = 0
    expiresAt.value = 0
  }

  return {
    sentAt,
    resendAvailableAt,
    expiresAt,
    applyDelivery,
    applyRejection,
    clearOtpTimers,
  }
}

/**
 * Ticking view of the deadlines above, for components rendering a countdown.
 *
 * Values are recomputed from the wall clock on every tick rather than
 * decremented, so a throttled background tab or a sleeping device cannot leave
 * the countdown running behind the server.
 */
export function useOtpCountdown() {
  const { sentAt, resendAvailableAt, expiresAt } = useOtpTimers()

  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | null = null

  const resendRemaining = computed(() =>
    secondsUntil(resendAvailableAt.value, now.value),
  )
  const expiresIn = computed(() => secondsUntil(expiresAt.value, now.value))
  const canResend = computed(() => resendRemaining.value <= 0)
  const codeExpired = computed(
    () => expiresAt.value > 0 && expiresIn.value <= 0,
  )
  /** Seconds since the last delivery, or null when nothing has been sent yet. */
  const sinceSent = computed(() =>
    sentAt.value > 0
      ? Math.max(0, Math.floor((now.value - sentAt.value) / 1000))
      : null,
  )

  function sync() {
    now.value = Date.now()
  }

  onMounted(() => {
    sync()
    timer = setInterval(sync, 1000)
    if (import.meta.client) document.addEventListener('visibilitychange', sync)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
    timer = null
    if (import.meta.client) document.removeEventListener('visibilitychange', sync)
  })

  return {
    resendRemaining,
    expiresIn,
    canResend,
    codeExpired,
    sinceSent,
  }
}
