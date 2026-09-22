import type { ApiResponse } from '~/types/api'
import type { Company } from '~/types/company'
import type {
  CompanyMediaValue,
  CompanyProfileFormErrors,
  CompanyProfileFormModel,
  CompanyProfileSectionKey,
} from '~/types/company-profile-form'
import {
  COMPANY_PROFILE_SECTIONS,
  createEmptyCompanyProfileForm,
  isCompanyProfileSectionComplete,
  toGalleryPayload,
  toMediaPayload,
} from '~/types/company-profile-form'
import type { ISelectItem } from '~/types/select-item'
import { shrinkLogoForUpload } from '~/utils/shrink-logo-upload'

export type CompanyMediaCollection = 'logo' | 'cover' | 'gallery'

export interface UploadedMedia {
  id: number
  uuid?: string
  collection?: string
  path: string
  url: string
  file_name?: string
}

const DEFAULT_LOGO_MARKERS = [
  'company-default',
  'images/company-default',
  'default-avatar',
]

function uploadErrorMessage(err: unknown): string {
  const fallback = 'آپلود تصویر با خطا مواجه شد'
  if (!err || typeof err !== 'object') return fallback

  const status = 'status' in err ? Number((err as { status?: number }).status) : NaN
  if (status === 413) return 'حجم فایل بیشتر از حد مجاز سرور است.'

  const message =
    'message' in err ? String((err as { message?: string }).message ?? '') : ''
  if (/failed to fetch|networkerror|load failed|content too large/i.test(message)) {
    return 'آپلود تصویر انجام نشد.'
  }

  return message.trim() || fallback
}

function isDefaultLogoUrl(url: string | null | undefined) {
  if (!url) return true
  return DEFAULT_LOGO_MARKERS.some((marker) => url.includes(marker))
}

/** Extract relative disk path from a public storage URL when API only returns URLs. */
export function extractStoragePath(url: string | null | undefined): string | null {
  if (!url) return null

  try {
    const parsed = new URL(url, 'https://placeholder.local')
    const path = parsed.pathname
    const storageIndex = path.indexOf('/storage/')
    if (storageIndex >= 0) {
      return decodeURIComponent(path.slice(storageIndex + '/storage/'.length))
    }
  } catch {
    // fall through
  }

  if (url.startsWith('companies/')) return url
  return null
}

function mediaFromUrl(url: string | null | undefined): CompanyMediaValue | null {
  if (!url || isDefaultLogoUrl(url)) return null
  return {
    url,
    path: extractStoragePath(url),
    id: null,
  }
}

function mediaFromUpload(uploaded: UploadedMedia): CompanyMediaValue {
  return {
    id: uploaded.id,
    path: uploaded.path,
    url: uploaded.url,
  }
}

function fillFormFromCompany(
  form: CompanyProfileFormModel,
  company: Company & {
    province_id?: number | null
    city_id?: number | null
  },
  provinces: ISelectItem[],
) {
  form.id = company.id ?? null
  form.name = company.name ?? ''
  form.activity = company.activity ?? ''
  form.size = company.size ?? ''
  form.website = company.website ?? ''
  form.tel = company.tel ?? ''
  form.is_tell_public = Boolean(company.is_tell_public)
  form.intro = company.intro ?? ''
  form.province_name = company.province_name ?? ''
  form.city_name = company.city_name ?? ''
  form.province =
    company.province_id ??
    (provinces.find((item) => item.label === company.province_name)?.value as
      | number
      | undefined) ??
    null
  form.city = company.city_id ?? null
  form.address = company.address ?? ''
  form.lat = company.lat
  form.long = company.long
  form.logo = mediaFromUrl(company.logo)
  form.cover = mediaFromUrl(company.cover)
  form.gallery = (company.gallery ?? [])
    .map((url) => mediaFromUrl(url))
    .filter((item): item is CompanyMediaValue => item != null)
  form.is_profile_public = Boolean(company.is_profile_public)
  form.slug = company.slug ?? ''
}

function buildSectionPayload(
  form: CompanyProfileFormModel,
  section: CompanyProfileSectionKey,
): Record<string, unknown> {
  // UpdateCompanyRequest / StoreCompanyRequest require name on every write.
  const base: Record<string, unknown> = {
    name: form.name.trim(),
  }

  switch (section) {
    case 'logo':
      return {
        ...base,
        logo: toMediaPayload(form.logo),
      }
    case 'basic':
      return {
        ...base,
        activity: form.activity || null,
        size: form.size || null,
        website: form.website.trim() || null,
        tel: form.tel.trim() || null,
        is_tell_public: form.is_tell_public,
        logo: toMediaPayload(form.logo),
      }
    case 'intro':
      return {
        ...base,
        intro: form.intro.trim() || null,
      }
    case 'location':
      return {
        ...base,
        province_id: form.province,
        province_name: form.province_name || null,
        city_id: form.city,
        city_name: form.city_name || null,
        address: form.address.trim() || null,
        lat: form.lat,
        long: form.long,
      }
    case 'gallery':
      return {
        ...base,
        gallery: toGalleryPayload(form.gallery),
      }
    case 'cover':
      return {
        ...base,
        cover: toMediaPayload(form.cover),
      }
    case 'visibility':
      return {
        ...base,
        is_profile_public: form.is_profile_public,
      }
  }
}

function validateSection(
  form: CompanyProfileFormModel,
  section: CompanyProfileSectionKey,
): CompanyProfileFormErrors {
  const errors: CompanyProfileFormErrors = {}

  if (section === 'basic') {
    if (!form.name.trim()) errors.name = 'نام شرکت الزامی است'
    if (!form.activity) errors.activity = 'نوع فعالیت الزامی است'
    if (!form.size) errors.size = 'تعداد پرسنل الزامی است'
  }

  if (section === 'intro' && !form.intro.trim()) {
    errors.intro = 'معرفی سازمان الزامی است'
  }

  if (section === 'location') {
    if (!form.province) errors.province = 'استان الزامی است'
    if (!form.city) errors.city = 'شهر الزامی است'
    if (!form.address.trim()) errors.address = 'آدرس الزامی است'
  }

  if (!form.name.trim() && section !== 'basic') {
    errors.name = 'ابتدا نام شرکت را در اطلاعات پایه ذخیره کنید'
  }

  return errors
}

function unwrapUserCompany(user: unknown): Company | null {
  if (!user || typeof user !== 'object') return null
  const root = user as Record<string, unknown>
  const data = (root.data && typeof root.data === 'object'
    ? root.data
    : root) as Record<string, unknown>
  const company = data.company
  if (!company || typeof company !== 'object') return null
  return company as Company
}

export function useCompanyProfileForm() {
  const api = useApi()
  const { $toast } = useNuxtApp()
  const sanctumUser = useSanctumUser()
  const { user, patchUser } = useCurrentUser()

  const form = ref<CompanyProfileFormModel>(createEmptyCompanyProfileForm())
  const errors = ref<CompanyProfileFormErrors>({})
  const loading = ref(true)
  const savingSection = ref<CompanyProfileSectionKey | null>(null)
  const uploading = ref(false)
  const savingLogo = ref(false)
  /** Last name stored on the company, so a logo save does not write unsaved field edits. */
  const persistedName = ref('')
  let logoSaveSeq = 0

  const { items } = useLookups('industries,company_sizes,provinces')
  const activityOptions = items('industries')
  const sizeOptions = items('company_sizes')
  const provinceOptions = items('provinces')

  const cityOptions = ref<ISelectItem[]>([])
  const citiesLoading = ref(false)

  function syncEmployerLogo(url: string | null) {
    const fields: Record<string, unknown> = { company_logo: url }
    const current = user.value?.company
    if (current && typeof current === 'object') {
      fields.company = {
        ...(current as Record<string, unknown>),
        logo: url,
      }
    }
    patchUser(fields)
  }

  const sectionStates = computed(() =>
    COMPANY_PROFILE_SECTIONS.map((section) => ({
      ...section,
      complete: isCompanyProfileSectionComplete(form.value, section.key),
    })),
  )

  const completionPercent = computed(() => {
    const total = sectionStates.value.length
    const done = sectionStates.value.filter((s) => s.complete).length
    return total ? Math.round((done / total) * 100) : 0
  })

  async function loadCities(provinceId: number) {
    citiesLoading.value = true
    try {
      cityOptions.value = await api.get<ISelectItem[]>(`/cities/${provinceId}`)
    } catch {
      cityOptions.value = []
    } finally {
      citiesLoading.value = false
    }
  }

  async function syncLocationFields() {
    if (!form.value.province) {
      cityOptions.value = []
      return
    }

    await loadCities(form.value.province)

    if (form.value.city) return
    if (!form.value.city_name) return

    const matchedCity = cityOptions.value.find(
      (item) => item.label === form.value.city_name,
    )
    if (matchedCity) form.value.city = Number(matchedCity.value)
  }

  async function load() {
    loading.value = true
    try {
      let company = unwrapUserCompany(sanctumUser.value)

      if (!company) {
        const result = await api.get<ApiResponse<{ company?: Company }> | Company>(
          '/user',
        )
        const payload = (result as ApiResponse<{ company?: Company }>).data ?? result
        company = (payload as { company?: Company })?.company ?? null
      }

      if (company?.slug && !company.id) {
        const detail = await api.get<ApiResponse<Company>>(
          `/companies/${company.slug}`,
        )
        company = detail.data ?? company
      } else if (company?.slug) {
        // Prefer full company resource (fresh media URLs)
        try {
          const detail = await api.get<ApiResponse<Company>>(
            `/companies/${company.slug}`,
          )
          if (detail.data) company = detail.data
        } catch {
          // keep company from user
        }
      }

      if (company) {
        fillFormFromCompany(form.value, company, provinceOptions.value)
        persistedName.value = (company.name ?? '').trim()
        syncEmployerLogo(form.value.logo?.url ?? null)
        await syncLocationFields()
      } else {
        Object.assign(form.value, createEmptyCompanyProfileForm())
        persistedName.value = ''
      }
    } catch {
      Object.assign(form.value, createEmptyCompanyProfileForm())
      persistedName.value = ''
    } finally {
      loading.value = false
    }
  }

  async function saveSection(section: CompanyProfileSectionKey) {
    const validationErrors = validateSection(form.value, section)
    errors.value = { ...validationErrors }

    if (Object.keys(validationErrors).length) {
      $toast.error('لطفا فیلدهای الزامی را تکمیل کنید')
      return false
    }

    if (!form.value.id && section !== 'basic') {
      $toast.error('ابتدا اطلاعات پایه سازمان را ذخیره کنید')
      return false
    }

    savingSection.value = section
    try {
      const payload = buildSectionPayload(form.value, section)
      let result: ApiResponse<Company>

      if (form.value.id) {
        result = await api.put<ApiResponse<Company>>(
          `/companies/${form.value.id}`,
          payload,
        )
      } else {
        result = await api.post<ApiResponse<Company>>('/companies', payload)
      }

      if (result.data) {
        fillFormFromCompany(form.value, result.data, provinceOptions.value)
        persistedName.value = (result.data.name ?? '').trim()
        syncEmployerLogo(form.value.logo?.url ?? null)
        await syncLocationFields()
      }

      $toast.success('تغییرات با موفقیت ذخیره شد')
      return true
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'ذخیره تغییرات با خطا مواجه شد'
      $toast.error(message)
      return false
    } finally {
      savingSection.value = null
    }
  }

  async function uploadImage(
    kind: CompanyMediaCollection,
    file: File,
    options?: { apply?: boolean },
  ) {
    uploading.value = true
    try {
      const payload = kind === 'logo' ? await shrinkLogoForUpload(file) : file
      const formData = new FormData()
      formData.append('file', payload)
      formData.append('collection', kind)

      const res = await api.post<ApiResponse<UploadedMedia>>('/media', formData)
      const uploaded = res.data

      if (!uploaded?.id || !uploaded.url) {
        throw new Error('پاسخ آپلود نامعتبر است')
      }

      const media = mediaFromUpload(uploaded)

      if (options?.apply !== false) {
        if (kind === 'logo') form.value.logo = media
        else if (kind === 'cover') form.value.cover = media
        else form.value.gallery = [...form.value.gallery, media]
      }

      return media
    } catch (err: unknown) {
      $toast.error(uploadErrorMessage(err))
      return null
    } finally {
      uploading.value = false
    }
  }

  function removeGalleryImage(index: number) {
    form.value.gallery = form.value.gallery.filter((_, i) => i !== index)
  }

  async function uploadLogo(file: File) {
    const seq = ++logoSaveSeq
    const previous = form.value.logo
    const previewUrl = URL.createObjectURL(file)
    form.value.logo = { id: null, path: null, url: previewUrl }
    savingLogo.value = true

    try {
      const media = await uploadImage('logo', file, { apply: false })
      if (seq !== logoSaveSeq) return false
      if (!media) {
        form.value.logo = previous
        return false
      }

      form.value.logo = media

      if (!form.value.id) return true

      const name = persistedName.value.trim()
      if (!name) return true

      const result = await api.put<ApiResponse<Company>>(
        `/companies/${form.value.id}`,
        {
          name,
          logo: toMediaPayload(media),
        },
      )

      if (seq !== logoSaveSeq) return false

      const savedLogo = mediaFromUrl(result.data?.logo)
      if (savedLogo) form.value.logo = savedLogo
      syncEmployerLogo(form.value.logo?.url ?? null)

      $toast.success('لوگو با موفقیت ذخیره شد')
      return true
    } catch (err: unknown) {
      if (seq !== logoSaveSeq) return false
      form.value.logo = previous
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'ذخیره لوگو با خطا مواجه شد'
      $toast.error(message)
      return false
    } finally {
      URL.revokeObjectURL(previewUrl)
      if (seq === logoSaveSeq) savingLogo.value = false
    }
  }

  async function removeLogo() {
    const seq = ++logoSaveSeq
    const previous = form.value.logo
    form.value.logo = null
    savingLogo.value = true

    try {
      if (!form.value.id) return true

      const name = persistedName.value.trim()
      if (!name) return true

      await api.put<ApiResponse<Company>>(`/companies/${form.value.id}`, {
        name,
        logo: null,
      })

      if (seq !== logoSaveSeq) return false

      form.value.logo = null
      syncEmployerLogo(null)
      $toast.success('لوگو حذف شد')
      return true
    } catch (err: unknown) {
      if (seq !== logoSaveSeq) return false
      form.value.logo = previous
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'حذف لوگو با خطا مواجه شد'
      $toast.error(message)
      return false
    } finally {
      if (seq === logoSaveSeq) savingLogo.value = false
    }
  }

  onMounted(() => {
    load()
  })

  return {
    form,
    errors,
    loading,
    savingSection,
    uploading,
    savingLogo,
    activityOptions,
    sizeOptions,
    cityOptions,
    citiesLoading,
    sectionStates,
    completionPercent,
    loadCities,
    reload: load,
    saveSection,
    uploadImage,
    uploadLogo,
    removeLogo,
    removeGalleryImage,
  }
}
