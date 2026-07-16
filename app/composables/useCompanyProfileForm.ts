import type { ApiResponse } from '~/types/api'
import type { Company } from '~/types/company'
import type {
  CompanyProfileFormErrors,
  CompanyProfileFormModel,
  CompanyProfileSectionKey,
} from '~/types/company-profile-form'
import {
  COMPANY_PROFILE_SECTIONS,
  createEmptyCompanyProfileForm,
  isCompanyProfileSectionComplete,
} from '~/types/company-profile-form'
import type { ISelectItem } from '~/types/select-item'

const COMPANY_PROFILE_ENDPOINT = '/employers/company'

function fillFormFromCompany(
  form: CompanyProfileFormModel,
  company: Company,
) {
  form.name = company.name ?? ''
  form.activity = company.activity ?? ''
  form.size = company.size ?? ''
  form.website = company.website ?? ''
  form.tel = company.tel ?? ''
  form.is_tell_public = Boolean(company.is_tell_public)
  form.intro = company.intro ?? ''
  form.province_name = company.province_name ?? ''
  form.city_name = company.city_name ?? ''
  form.address = company.address ?? ''
  form.lat = company.lat
  form.long = company.long
  form.logo = company.logo ?? ''
  form.cover = company.cover ?? ''
  form.gallery = company.gallery ?? []
  form.is_profile_public = Boolean(company.is_profile_public)
  form.slug = company.slug ?? ''
}

function buildSectionPayload(
  form: CompanyProfileFormModel,
  section: CompanyProfileSectionKey,
): Record<string, unknown> {
  switch (section) {
    case 'basic':
      return {
        name: form.name.trim(),
        activity: form.activity,
        size: form.size,
        website: form.website.trim(),
        tel: form.tel.trim(),
        is_tell_public: form.is_tell_public,
      }
    case 'intro':
      return { intro: form.intro.trim() }
    case 'location':
      return {
        province: form.province,
        province_name: form.province_name,
        city: form.city,
        city_name: form.city_name,
        region: form.region,
        region_name: form.region_name,
        address: form.address.trim(),
        lat: form.lat,
        long: form.long,
      }
    case 'gallery':
      return { gallery: form.gallery }
    case 'cover':
      return { cover: form.cover }
    case 'visibility':
      return { is_profile_public: form.is_profile_public }
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

  return errors
}

export function useCompanyProfileForm() {
  const api = useApi()
  const { $toast } = useNuxtApp()

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
      const result = await api.get<ApiResponse<Company>>(
        COMPANY_PROFILE_ENDPOINT,
      )
      if (result.data) {
        fillFormFromCompany(form.value, result.data)
      }
    } catch {
      // No company profile yet — keep the empty form.
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

    savingSection.value = section
    try {
      await api.post(COMPANY_PROFILE_ENDPOINT, buildSectionPayload(form.value, section))
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

  async function uploadImage(kind: 'logo' | 'cover' | 'gallery', file: File) {
    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await api.post<ApiResponse<{ url?: string; path?: string }>>(
        `${COMPANY_PROFILE_ENDPOINT}/upload/${kind}`,
        formData,
      )
      const url = res.data?.url ?? res.data?.path ?? URL.createObjectURL(file)

      if (kind === 'logo') form.value.logo = url
      else if (kind === 'cover') form.value.cover = url
      else form.value.gallery = [...form.value.gallery, url]

      return true
    } catch {
      $toast.error('آپلود تصویر با خطا مواجه شد')
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
