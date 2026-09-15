import type { AccountRole } from '~/features/account/types'
import { getApiErrorData } from '~/utils/api-error'
import { resolvePostLoginLocation } from '~/utils/entering-route'
import { normalizeIranMobile } from '~/utils/iran-mobile'
import { resolvePrimaryRole } from '~/utils/user-role'

function normalizeMobile(phone: string) {
  return normalizeIranMobile(phone)
}

export type AuthUserStatus = 'new_user' | 'existing_user'

export interface RequestOtpResponse {
  request_id: string
  message: string
  /** Seconds the code stays valid, counted from its original creation. */
  expires_in: number
  /** Seconds until another SMS may be requested. */
  remaining_seconds: number
  /** False for the first SMS of a code, true for every later delivery. */
  resent: boolean
  status?: AuthUserStatus
  has_role?: boolean
}

export interface RequestOtpVoiceResponse {
  message: string
  expires_in: number
  remaining_seconds: number
}

export interface VerifyOtpResponse {
  message: string
  status: AuthUserStatus
  user_id: string
  has_role: boolean
  registration_token?: string
}

function getErrorMessage(err: any, fallback: string) {
  return err?.data?.message || err?.response?._data?.message || err?.message || fallback
}

function snapshotQuery(query: Record<string, unknown>) {
  const snap: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(query)) {
    if (value == null) continue
    snap[key] = Array.isArray(value) ? [...value] : value
  }
  return snap
}

export function useAccountAuth() {
  const client = useSanctumClient()
  const { login, refreshIdentity, isAuthenticated } = useSanctumAuth()
  const { $toast } = useNuxtApp()

  const mobile = useState('account.mobile', () => '')
  const requestId = useState('account.requestId', () => '')
  const userId = useState('account.userId', () => '')
  const registrationToken = useState('account.registrationToken', () => '')
  const status = useState<AuthUserStatus | null>('account.status', () => null)
  const hasRole = useState<boolean | null>('account.hasRole', () => null)
  const selectedRole = useState<AccountRole | null>('account.selectedRole', () => null)
  const loading = useState('account.loading', () => false)
  const voiceSent = useState('account.voiceSent', () => false)

  const { applyDelivery, applyRejection, clearOtpTimers } = useOtpTimers()

  const needsRegistration = computed(
    () => status.value === 'new_user' || hasRole.value === false,
  )

  /**
   * Requests a code, and doubles as the resend call. While a code is still
   * valid the server returns the same request_id and resends that same code, so
   * overwriting requestId here is always safe.
   */
  async function requestOtp(phone: string) {
    const normalized = normalizeMobile(phone)
    loading.value = true
    try {
      const res = await client<RequestOtpResponse>('/api/request-otp', {
        method: 'POST',
        body: { mobile: normalized },
      })
      mobile.value = normalized
      requestId.value = res.request_id
      status.value = res.status ?? null
      userId.value = ''
      registrationToken.value = ''
      hasRole.value = typeof res.has_role === 'boolean' ? res.has_role : null
      selectedRole.value = null
      voiceSent.value = false
      applyDelivery(res)
      return res
    } catch (err: any) {
      // A 429 still tells us when the next send is allowed, so the countdown
      // reflects the real wait instead of restarting at the default cooldown.
      const rejection = applyRejection(getApiErrorData(err))
      // A refused resend hands back the live code's request_id, so a reload
      // that dropped ours can carry on with the code already in the user's
      // hands rather than waiting the cooldown out.
      if (rejection?.requestId) {
        mobile.value = normalized
        requestId.value = rejection.requestId
      }
      $toast.error(
        rejection?.block === 'rate_limit'
          ? // The server's copy cannot name a time; this one can.
            otpRateLimitMessage(rejection.seconds)
          : getErrorMessage(err, 'ارسال کد با خطا مواجه شد'),
      )
      throw err
    } finally {
      loading.value = false
    }
  }

  async function requestOtpViaVoice() {
    if (!requestId.value) {
      $toast.error('ابتدا شماره موبایل را وارد کنید')
      throw new Error('request_id missing')
    }

    loading.value = true
    try {
      const res = await client<RequestOtpVoiceResponse>('/api/request-otp-voice', {
        method: 'POST',
        body: { request_id: requestId.value },
      })
      $toast.success(res.message || 'تماس صوتی برقرار شد')
      voiceSent.value = true
      // Voice is exempt from the SMS cooldown server-side, so this only
      // refreshes the reported deadlines without counting as a new delivery.
      applyDelivery(res, false)
      return res
    } catch (err: any) {
      const rejection = applyRejection(getApiErrorData(err))
      $toast.error(
        rejection?.block === 'rate_limit'
          ? otpRateLimitMessage(rejection.seconds)
          : getErrorMessage(err, 'ارسال کد با تماس با خطا مواجه شد'),
      )
      throw err
    } finally {
      loading.value = false
    }
  }

  async function verifyOtp(otp: string) {
    if (!requestId.value) {
      $toast.error('ابتدا شماره موبایل را وارد کنید')
      throw new Error('request_id missing')
    }

    loading.value = true
    try {
      const res = await client<VerifyOtpResponse>('/api/verify-otp', {
        method: 'POST',
        body: {
          request_id: requestId.value,
          otp,
        },
      })
      userId.value = res.user_id
      status.value = res.status
      hasRole.value = res.has_role
      registrationToken.value = res.registration_token || ''
      // The code is consumed on the server the moment it verifies.
      clearOtpTimers()
      return res
    } catch (err: any) {
      $toast.error(getErrorMessage(err, 'کد تایید نامعتبر است'))
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Session login via nuxt-auth-sanctum.
   * Pass redirect=false during signup so onboarding can continue.
   * When redirect=true, uses the login URL query captured before login()
   * so CTA to/role survive if the route changes.
   */
  async function navigateAfterLogin(intentQuery: Record<string, unknown>) {
    await refreshIdentity()
    const { user, refreshUser } = useCurrentUser()
    await refreshUser()

    await navigateTo(
      resolvePostLoginLocation(
        intentQuery,
        resolvePrimaryRole(user.value) !== null,
      ),
    )
  }

  async function loginWithMobile(phone?: string, redirect = true) {
    const username = normalizeMobile(phone || mobile.value)
    if (!username) {
      $toast.error('شماره موبایل یافت نشد')
      throw new Error('mobile missing')
    }

    const intentQuery = snapshotQuery(useRoute().query)

    loading.value = true
    try {
      if (!isAuthenticated.value) {
        await login({ username })
      }
      if (redirect) {
        await navigateAfterLogin(intentQuery)
      } else {
        await refreshIdentity()
        const { refreshUser } = useCurrentUser()
        await refreshUser()
      }
    } catch (err: any) {
      $toast.error(getErrorMessage(err, 'ورود با خطا مواجه شد'))
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Assign role only via PUT users/{user}. Requires an active Sanctum session.
   */
  async function updateUserRole(role: AccountRole) {
    const id = userId.value || useCurrentUser().user.value?.id
    if (!id) {
      $toast.error('شناسه کاربر یافت نشد')
      throw new Error('user_id missing')
    }

    loading.value = true
    try {
      await client(`/api/v1/users/${id}`, {
        method: 'PUT',
        body: { role },
      })
      selectedRole.value = role
      hasRole.value = true
      await refreshIdentity()
      return role
    } catch (err: any) {
      $toast.error(getErrorMessage(err, 'ثبت نقش کاربری با خطا مواجه شد'))
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Complete signup profile, then create the Sanctum session.
   */
  async function completeProfile(payload: {
    name: string
    password?: string
    avatar?: File | null
  }) {
    if (!registrationToken.value) {
      $toast.error('ابتدا کد تایید را وارد کنید')
      throw new Error('registration_token missing')
    }

    loading.value = true
    try {
      const formData = new FormData()
      formData.append('registration_token', registrationToken.value)
      formData.append('name', payload.name)
      if (payload.avatar) formData.append('avatar', payload.avatar)
      if (payload.password) formData.append('password', payload.password)

      await client('/api/complete-registration', {
        method: 'POST',
        body: formData,
      })
      registrationToken.value = ''
    } catch (err: any) {
      $toast.error(getErrorMessage(err, 'تکمیل حساب با خطا مواجه شد'))
      throw err
    } finally {
      loading.value = false
    }

    await loginWithMobile(mobile.value, false)
  }

  function reset() {
    mobile.value = ''
    requestId.value = ''
    userId.value = ''
    registrationToken.value = ''
    status.value = null
    hasRole.value = null
    selectedRole.value = null
    voiceSent.value = false
    clearOtpTimers()
  }

  return {
    mobile,
    requestId,
    userId,
    registrationToken,
    status,
    hasRole,
    selectedRole,
    loading,
    voiceSent,
    needsRegistration,
    requestOtp,
    requestOtpViaVoice,
    verifyOtp,
    updateUserRole,
    loginWithMobile,
    completeProfile,
    reset,
  }
}
