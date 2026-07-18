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
import { provinces } from '~/feeders/provinces'
import type { ISelectItem } from '~/types/select-item'

export type CompanyMediaCollection = 'logo' | 'cover' | 'gallery'

export interface UploadedMedia {
  id: number
  uuid?: string
  collection?: string
  path: string
  url: string
  file_name?: string
}

const DEFAULT_LOGO_MARKERS = ['company-default', 'images/company-default']

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
  form.region = null
  form.region_name = ''
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

  const form = ref<CompanyProfileFormModel>(createEmptyCompanyProfileForm())
  const errors = ref<CompanyProfileFormErrors>({})
  const loading = ref(true)
  const savingSection = ref<CompanyProfileSectionKey | null>(null)
  const uploading = ref(false)

  const { items } = useLookups('industries,company_sizes')
  const activityOptions = items('industries')
  const sizeOptions = items('company_sizes')

  const cityOptions = ref<ISelectItem[]>([])
  const regionOptions = ref<ISelectItem[]>([])
  const citiesLoading = ref(false)
  const regionsLoading = ref(false)

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

  async function loadRegions(cityId: number) {
    regionsLoading.value = true
    try {
      regionOptions.value = await api.get<ISelectItem[]>(`/regions/${cityId}`)
    } catch {
      regionOptions.value = []
    } finally {
      regionsLoading.value = false
    }
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
        fillFormFromCompany(form.value, company)
        if (form.value.province) {
          await loadCities(form.value.province)
          if (!form.value.city && form.value.city_name) {
            const matchedCity = cityOptions.value.find(
              (item) => item.label === form.value.city_name,
            )
            if (matchedCity) form.value.city = Number(matchedCity.value)
          }
        }
        if (form.value.city) await loadRegions(form.value.city)
      } else {
        Object.assign(form.value, createEmptyCompanyProfileForm())
      }
    } catch {
      Object.assign(form.value, createEmptyCompanyProfileForm())
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
        fillFormFromCompany(form.value, result.data)
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

  async function uploadImage(kind: CompanyMediaCollection, file: File) {
    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('collection', kind)

      const res = await api.post<ApiResponse<UploadedMedia>>('/media', formData)
      const uploaded = res.data

      if (!uploaded?.id || !uploaded.url) {
        throw new Error('پاسخ آپلود نامعتبر است')
      }

      const media = mediaFromUpload(uploaded)

      if (kind === 'logo') form.value.logo = media
      else if (kind === 'cover') form.value.cover = media
      else form.value.gallery = [...form.value.gallery, media]

      return true
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: string }).message)
          : 'آپلود تصویر با خطا مواجه شد'
      $toast.error(message)
      return false
    } finally {
      uploading.value = false
    }
  }

  function removeGalleryImage(index: number) {
    form.value.gallery = form.value.gallery.filter((_, i) => i !== index)
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
    activityOptions,
    sizeOptions,
    cityOptions,
    regionOptions,
    citiesLoading,
    regionsLoading,
    sectionStates,
    completionPercent,
    loadCities,
    loadRegions,
    reload: load,
    saveSection,
    uploadImage,
    removeGalleryImage,
  }
}
