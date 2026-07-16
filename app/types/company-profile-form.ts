export interface CompanyProfileFormModel {
  name: string
  activity: string
  size: string
  website: string
  tel: string
  is_tell_public: boolean
  intro: string
  province: number | null
  province_name: string
  city: number | null
  city_name: string
  region: number | null
  region_name: string
  address: string
  lat: number | null
  long: number | null
  logo: string
  cover: string
  gallery: string[]
  is_profile_public: boolean
  slug: string
}

export interface CompanyProfileFormErrors {
  name?: string
  activity?: string
  size?: string
  intro?: string
  province?: string
  city?: string
  address?: string
}

export type CompanyProfileSectionKey =
  | 'basic'
  | 'intro'
  | 'location'
  | 'gallery'
  | 'cover'
  | 'visibility'

export interface CompanyProfileSection {
  key: CompanyProfileSectionKey
  label: string
}

export const COMPANY_PROFILE_SECTIONS: CompanyProfileSection[] = [
  { key: 'basic', label: 'اطلاعات پایه' },
  { key: 'intro', label: 'معرفی سازمان' },
  { key: 'location', label: 'موقعیت مکانی سازمان' },
  { key: 'gallery', label: 'گالری تصاویر' },
  { key: 'cover', label: 'عکس سرصفحه' },
  { key: 'visibility', label: 'تمایل رویت برای همه' },
]

export function createEmptyCompanyProfileForm(): CompanyProfileFormModel {
  return {
    name: '',
    activity: '',
    size: '',
    website: '',
    tel: '',
    is_tell_public: false,
    intro: '',
    province: null,
    province_name: '',
    city: null,
    city_name: '',
    region: null,
    region_name: '',
    address: '',
    lat: null,
    long: null,
    logo: '',
    cover: '',
    gallery: [],
    is_profile_public: false,
    slug: '',
  }
}

export function isCompanyProfileSectionComplete(
  form: CompanyProfileFormModel,
  key: CompanyProfileSectionKey,
): boolean {
  switch (key) {
    case 'basic':
      return Boolean(form.name.trim() && form.activity && form.size)
    case 'intro':
      return form.intro.trim().length > 0
    case 'location':
      return Boolean(form.province && form.city && form.address.trim())
    case 'gallery':
      return form.gallery.length > 0
    case 'cover':
      return Boolean(form.cover)
    case 'visibility':
      return form.is_profile_public
  }
}
