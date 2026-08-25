import type { AccountRole } from '~/features/account/types'
import { paths } from '~/routes'

export type AuthUserStatus = 'new_user' | 'existing_user'

export interface RequestOtpResponse {
  request_id: string
  message: string
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

  async function requestOtp(phone: string) {
    loading.value = true
    try {
      const res = await client<RequestOtpResponse>('/api/request-otp', {
        method: 'POST',
        body: { mobile: phone },
      })
      mobile.value = phone
      requestId.value = res.request_id
      status.value = null
      userId.value = ''
      registrationToken.value = ''
      hasRole.value = null
      selectedRole.value = null
      return res
    } catch (err: any) {
      $toast.error(getErrorMessage(err, 'ارسال کد با خطا مواجه شد'))
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
   * When redirect=true, honors ?redirect= from the login URL if it is a safe relative path.
   */
  async function loginWithMobile(phone?: string, redirect = true) {
    const username = phone || mobile.value
    if (!username) {
      $toast.error('شماره موبایل یافت نشد')
      throw new Error('mobile missing')
    }

    loading.value = true
    try {
      if (!isAuthenticated.value) {
        await login({ username })
      }
      if (redirect) {
        const route = useRoute()
        const redirectTo =
          typeof route.query.redirect === 'string' &&
          route.query.redirect.startsWith('/') &&
          !route.query.redirect.startsWith('//')
            ? route.query.redirect
            : paths.dashboard

        await navigateTo(redirectTo)
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
    requestOtp,
    verifyOtp,
    updateUserRole,
    loginWithMobile,
    completeProfile,
    reset,
  }
}
