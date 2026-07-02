import type { ISelectItem } from '~/types/select-item'

export const COMPANY_PROVINCE_OPTIONS: ISelectItem[] = [
  { value: 11, label: 'خراسان رضوی' },
  { value: 8, label: 'تهران' },
  { value: 3, label: 'اصفهان' },
  { value: 4, label: 'فارس' },
]

export const COMPANY_ACTIVITY_OPTIONS: ISelectItem[] = [
  { value: 'trade', label: 'بازرگانی' },
  { value: 'manufacturing', label: 'تولیدی' },
  { value: 'service', label: 'خدماتی' },
  { value: 'construction', label: 'ساختمانی' },
]

export const COMPANY_SIZE_OPTIONS: ISelectItem[] = [
  { value: '1', label: 'تا ۱۰۰ نفر' },
  { value: '2', label: '۱۰۰ تا ۲۰۰ نفر' },
  { value: '3', label: '۲۰۰ تا ۵۰۰ نفر' },
  { value: '4', label: 'بیش از ۵۰۰ نفر' },
]

export const COMPANY_AD_COUNT_OPTIONS: ISelectItem[] = [
  { value: '1', label: '۱ تا ۵ آگهی' },
  { value: '2', label: '۶ تا ۱۰ آگهی' },
  { value: '3', label: 'بیش از ۱۰ آگهی' },
]

export const COMPANY_BENEFIT_OPTIONS: ISelectItem[] = [
  { value: 'insurance', label: 'بیمه تکمیلی' },
  { value: 'bonus', label: 'پاداش و هدایا' },
  { value: 'loan', label: 'وام سازمانی' },
]
