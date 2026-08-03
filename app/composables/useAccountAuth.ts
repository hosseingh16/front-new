import type { AccountRole } from '~/features/account/types'

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
}

function getErrorMessage(err: any, fallback: string) {
  return err?.data?.message || err?.response?._data?.message || err?.message || fallback
}

export function useAccountAuth() {
  const client = useSanctumClient()
  const { login, refreshIdentity } = useSanctumAuth()
  const { $toast } = useNuxtApp()

  const mobile = useState('account.mobile', () => '')
  const requestId = useState('account.requestId', () => '')
  const userId = useState('account.userId', () => '')
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
      return res
    } catch (err: any) {
      $toast.error(getErrorMessage(err, 'کد تایید نامعتبر است'))
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Assign role only via PUT users/{user}.
   */
  async function updateUserRole(role: AccountRole) {
    const id = userId.value || useCurrentUser().user.value?.id
    if (!id) {
      $toast.error('شناسه کاربر یافت نشد')
      throw new Error('user_id missing')
    }

    loading.value = true
    try {
      const api = useApi()
      await api.put(`/users/${id}`, { role })
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
   * Session login via Sanctum (same as test.login.vue).
   * Use redirect=false during signup so onboarding can continue.
   */
  async function loginWithMobile(phone?: string, redirect = true) {
    const username = phone || mobile.value
    if (!username) {
      $toast.error('شماره موبایل یافت نشد')
      throw new Error('mobile missing')
    }

    loading.value = true
    try {
      if (redirect) {
        await login({ username })
        return
      }

      await client('/api/login', {
        method: 'POST',
        body: { username },
      })
      await refreshIdentity()
    } catch (err: any) {
      $toast.error(getErrorMessage(err, 'ورود با خطا مواجه شد'))
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Complete signup profile via PUT users/{user}.
   * Name required; avatar and password optional.
   * Uses POST + _method spoof so PHP can parse the multipart avatar.
   */
  async function completeProfile(payload: {
    name: string
    password?: string
    avatar?: File | null
  }) {
    const id = userId.value || useCurrentUser().user.value?.id
    if (!id) {
      $toast.error('شناسه کاربر یافت نشد')
      throw new Error('user_id missing')
    }

    const formData = new FormData()
    formData.append('name', payload.name)
    if (payload.avatar) formData.append('avatar', payload.avatar)
    if (payload.password) formData.append('password', payload.password)
    formData.append('_method', 'PUT')

    loading.value = true
    try {
      const api = useApi()
      await api.post(`/users/${id}`, formData)
      await refreshIdentity()
    } catch (err: any) {
      $toast.error(getErrorMessage(err, 'تکمیل حساب با خطا مواجه شد'))
      throw err
    } finally {
      loading.value = false
    }
  }

  function reset() {
    mobile.value = ''
    requestId.value = ''
    userId.value = ''
    status.value = null
    hasRole.value = null
    selectedRole.value = null
  }

  return {
    mobile,
    requestId,
    userId,
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
