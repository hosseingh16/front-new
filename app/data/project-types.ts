import type { ISelectItem } from '~/types/select-item'

export type ProjectCategoryId =
  | 'current_accounting'
  | 'tax_operations'
  | 'costing_inventory'

export type ProjectCategoryDefinition = {
  value: ProjectCategoryId
  label: string
}

export type ProjectTypeDefinition = {
  value: string
  label: string
  category: ProjectCategoryId
  areas: ISelectItem[]
}

export type ProjectTimePreset = ISelectItem & {
  min?: number
  max?: number
}

export type ProjectBudgetPreset = ISelectItem & {
  min?: number
  max?: number
}

function areas(...labels: string[]): ISelectItem[] {
  return labels.map((label) => ({ label, value: label }))
}

export const PROJECT_CATEGORIES: ProjectCategoryDefinition[] = [
  {
    value: 'current_accounting',
    label: 'عملیات جاری حسابداری',
  },
  {
    value: 'tax_operations',
    label: 'عملیات مالیاتی',
  },
  {
    value: 'costing_inventory',
    label: 'عملیات بهای تمام شده و کنترل موجودی',
  },
]

export const PROJECT_TYPES: ProjectTypeDefinition[] = [
  {
    value: 'خدمات حسابداری عملیاتی',
    label: 'خدمات حسابداری عملیاتی',
    category: 'current_accounting',
    areas: areas(
      'انبارگردانی',
      'رفع مغایرت حساب‌ها (بانک، انبار، طرف حساب‌ها و صندوق)',
      'تهیه گزارش‌های روتین مالی',
      'تطبیق و رفع مغایرت حساب مشتریان',
      'ثبت عملیات خرید و فروش',
      'تنظیم صورت‌گردش حساب مشتریان و تأمین‌کنندگان',
      'کنترل صندوق و تنخواه‌گردان',
      'تهیه و ارسال لیست بیمه و مالیات حقوق',
      'ساماندهی و بایگانی اسناد مالی',
      'ثبت اسناد حسابداری',
      'پلمب و تحریر دفاتر قانونی',
    ),
  },
  {
    value: 'خدمات گزارش‌دهی و تحلیل مالی',
    label: 'خدمات گزارش‌دهی و تحلیل مالی',
    category: 'current_accounting',
    areas: areas(
      'تهیه صورت‌های مالی تلفیقی',
      'تهیه صورت‌های مالی',
      'تهیه گزارش‌های مدیریتی و تحلیلی',
      'بستن حساب‌ها در پایان سال مالی',
    ),
  },
  {
    value: 'خدمات حقوق و دستمزد',
    label: 'خدمات حقوق و دستمزد',
    category: 'current_accounting',
    areas: areas(
      'محاسبه حق سنوات و ذخیره مرخصی',
      'محاسبه حقوق و مزایا',
      'تهیه و مدیریت قراردادهای پرسنلی',
      'محاسبه بیمه و مالیات حقوق و ارسال ماهانه',
      'ثبت اطلاعات پرسنلی',
      'پیاده‌سازی سیستم حقوق و دستمزد',
    ),
  },
  {
    value: 'استقرار و بهینه‌سازی سیستم‌های مالی',
    label: 'استقرار و بهینه‌سازی سیستم‌های مالی',
    category: 'current_accounting',
    areas: areas(
      'استقرار سیستم مالی ERP',
      'پیاده‌سازی نرم‌افزارهای حسابداری',
      'انتقال اطلاعات از سیستم قبلی به سیستم جدید',
      'راه‌اندازی حساب‌ها در نرم‌افزار جدید',
      'طراحی کدینگ حسابداری',
    ),
  },
  {
    value: 'خدمات مالیاتی و اظهارنامه',
    label: 'خدمات مالیاتی و اظهارنامه',
    category: 'tax_operations',
    areas: areas(
      'تنظیم و ارسال اظهارنامه مالیات بر ارزش افزوده',
      'تهیه و ارسال اظهارنامه مالیاتی عملکرد',
      'استرداد مالیات',
      'بخشودگی جرائم مالیاتی',
      'پیگیری پرونده مالیاتی و دفاع در سازمان امور مالیاتی',
      'تطبیق اطلاعات سامانه مودیان، اظهارنامه ارزش افزوده و دفاتر',
    ),
  },
  {
    value: 'مدیریت انبار و دارایی‌های ثابت',
    label: 'مدیریت انبار و دارایی‌های ثابت',
    category: 'costing_inventory',
    areas: areas(
      'ایجاد سیستم کنترل موجودی',
      'انبارگردانی دوره‌ای',
      'کدگذاری و پلاک‌کوبی اموال و دارایی‌های ثابت',
      'قیمت‌گذاری موجودی پایان دوره',
      'محاسبه استهلاک دارایی‌ها',
    ),
  },
  {
    value: 'خدمات بهای تمام‌شده و تحلیل مالی',
    label: 'خدمات بهای تمام‌شده و تحلیل مالی',
    category: 'costing_inventory',
    areas: areas(
      'تحلیل نقطه سربه‌سر',
      'طراحی سیستم بهای تمام‌شده',
      'تحلیل بهای تمام‌شده و قیمت‌گذاری محصولات',
      'بودجه‌بندی و پیش‌بینی مالی',
      'طراحی و بازمهندسی فرآیندهای مالی',
      'ارزیابی سودآوری کسب‌وکار',
    ),
  },
]

export const PROJECT_TIME_OPTIONS: ProjectTimePreset[] = [
  { value: '1-3', label: '۱ تا ۳ روز', min: 1, max: 3 },
  { value: '4-7', label: '۴ تا ۷ روز', min: 4, max: 7 },
  { value: '8-14', label: '۱ تا ۲ هفته', min: 8, max: 14 },
  { value: '15-30', label: '۲ تا ۴ هفته', min: 15, max: 30 },
  { value: '31-60', label: '۱ تا ۲ ماه', min: 31, max: 60 },
  { value: '61-90', label: '۲ تا ۳ ماه', min: 61, max: 90 },
  { value: 'custom', label: 'بازه دلخواه' },
]

export const PROJECT_BUDGET_OPTIONS: ProjectBudgetPreset[] = [
  {
    value: '10-25',
    label: '۱۰ تا ۲۵ میلیون تومان',
    min: 10_000_000,
    max: 25_000_000,
  },
  {
    value: '25-50',
    label: '۲۵ تا ۵۰ میلیون تومان',
    min: 25_000_000,
    max: 50_000_000,
  },
  {
    value: '50-100',
    label: '۵۰ تا ۱۰۰ میلیون تومان',
    min: 50_000_000,
    max: 100_000_000,
  },
  {
    value: '100-200',
    label: '۱۰۰ تا ۲۰۰ میلیون تومان',
    min: 100_000_000,
    max: 200_000_000,
  },
  {
    value: '200-300',
    label: 'بیش از ۲۰۰ میلیون تومان',
    min: 200_000_000,
    max: 300_000_000,
  },
  { value: 'custom', label: 'بودجه دلخواه' },
]

export const PROJECT_TIME_VALUE_OPTIONS: ISelectItem[] = Array.from(
  { length: 90 },
  (_, index) => {
    const value = String(index + 1)
    return { value, label: `${value} روز` }
  },
)

export function getProjectCategoryLabel(
  category: string | null | undefined,
): string {
  if (!category) return ''
  return (
    PROJECT_CATEGORIES.find((item) => item.value === category)?.label ||
    category
  )
}

export function getProjectTypesByCategory(
  category: string | null | undefined,
): ISelectItem[] {
  if (!category) return []
  return PROJECT_TYPES.filter((item) => item.category === category).map(
    ({ value, label }) => ({ value, label }),
  )
}

export function getProjectAreas(type: string | null | undefined): ISelectItem[] {
  if (!type) return []
  return PROJECT_TYPES.find((item) => item.value === type)?.areas ?? []
}

export function getProjectTimePreset(value: string | null | undefined) {
  if (!value) return null
  return PROJECT_TIME_OPTIONS.find((item) => item.value === value) ?? null
}

export function getProjectBudgetPreset(value: string | null | undefined) {
  if (!value) return null
  return PROJECT_BUDGET_OPTIONS.find((item) => item.value === value) ?? null
}
