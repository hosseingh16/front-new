import type { Ad } from '~/types/ad'

export type StaticAdDetail = Ad & {
  expire_date?: string
}

const BASE_DETAIL: Omit<StaticAdDetail, 'id' | 'order_id' | 'title' | 'company_name' | 'category' | 'city_name' | 'province_name' | 'employment_type' | 'salary' | 'gender' | 'publish_date'> = {
  company_logo: '/images/ads/company-sepehr.png',
  company_software: 'اخوان',
  company_advantages: 'بیمه، بیمه تکمیلی، پاداش و هدایا، سرانه آموزشی، پزشک سازمانی، وام سازمانی، سرویس رفت و برگشت، ناهار، صبحانه',
  job_description: `<p>گروه صنعتی مهر در راستای توسعه تیم خود بدنبال فردی متعهد و توانمند است که در حوزه آنالیز قیمت بهای تمام شده به ما کمک کند تا رشد و پیشرفت شرکت را با هم رقم بزنیم.</p>`,
  resume_terms: `توانایی آنالیز بهای تمام شده محصولات
آنالیز قیمت مواد و قطعات تامین شده
آشنایی کامل هزینه یابی مرحله ای
آشنایی با مفاهیم OPC-BOM و فرآیند های سازمانی مربوط به تولید
آشنایی کامل با گردش کلی انبار`,
  minimum_work_experience: '2',
  minimum_degree: 'لیسانس',
  type: 'استخدامی',
  excel_skill: 5,
  bimeh_skill: 2,
  baha_skill: 5,
  maliat_skill: 3,
  status: 'published',
  verified: true,
  expired: false,
  is_bookmarked: false,
  expire_date: '20260115',
  company: {
    id: 1,
    name: 'بازرگانی سپهر',
    slug: 'sepehr-trading',
    size: null,
    activity: 'فروش آهن آلات',
    intro: '<p>بازرگانی سپهر با بیش از دو دهه سابقه در حوزه فروش آهن‌آلات، یکی از مجموعه‌های پیشرو در صنعت ساختمان کشور است.</p>',
    culture: null,
    advantages: null,
    logo: '/images/ads/company-sepehr.png',
    cover: '/images/ad-cover-bg.jpg',
    static_map: null,
    province_name: 'مشهد',
    city_name: 'وکیل آباد',
    lat: null,
    long: null,
    address: null,
    tel: null,
    is_tell_public: false,
    website: 'Sepehr.company.ir',
    gallery: [],
    is_profile_public: true,
  },
}

export const STATIC_AD_DETAILS: Record<number, StaticAdDetail> = {
  1001: {
    ...BASE_DETAIL,
    id: 1001,
    order_id: 1,
    title: 'استخدام حسابدار',
    company_name: 'بازرگانی سپهر',
    category: 'مشاور مالی',
    city_name: 'وکیل آباد',
    province_name: 'مشهد',
    employment_type: 'تمام وقت دورکاری',
    salary: '20 تا 25 میلیون تومان',
    gender: 'مهم نیست',
    publish_date: '20260101',
  },
  1002: {
    ...BASE_DETAIL,
    id: 1002,
    order_id: 2,
    title: 'حسابدار مالی',
    company_name: 'گروه صنعتی پارس',
    category: 'حسابدار',
    city_name: 'سعادت‌آباد',
    province_name: 'تهران',
    employment_type: 'پاره‌وقت',
    salary: '15 تا 18 میلیون تومان',
    gender: 'آقا / خانم',
    publish_date: '20251230',
    type: 'استخدامی',
    company: {
      ...BASE_DETAIL.company!,
      name: 'گروه صنعتی پارس',
      slug: 'pars-industrial',
      activity: 'تولید صنعتی',
      province_name: 'تهران',
      city_name: 'سعادت‌آباد',
      website: 'pars-industrial.ir',
    },
  },
  1003: {
    ...BASE_DETAIL,
    id: 1003,
    order_id: 3,
    title: 'کارشناس حسابداری پروژه',
    company_name: 'توسعه نرم‌افزار آریا',
    category: 'حسابدار پروژه',
    city_name: 'شریعتی',
    province_name: 'تهران',
    employment_type: 'پروژه',
    salary: 'توافقی',
    gender: 'آقا / خانم',
    publish_date: '20251228',
    type: 'پروژه',
    is_bookmarked: true,
    company: {
      ...BASE_DETAIL.company!,
      name: 'توسعه نرم‌افزار آریا',
      slug: 'arya-software',
      activity: 'فناوری اطلاعات',
      province_name: 'تهران',
      city_name: 'شریعتی',
      website: 'arya-software.ir',
    },
  },
  1004: {
    ...BASE_DETAIL,
    id: 1004,
    order_id: 4,
    title: 'کمک حسابدار',
    company_name: 'بازرگانی نفیس',
    category: 'کمک حسابدار',
    city_name: 'آزادگان',
    province_name: 'اصفهان',
    employment_type: 'تمام وقت',
    salary: '12 تا 15 میلیون تومان',
    gender: 'آقا',
    publish_date: '20251225',
    verified: false,
    company: {
      ...BASE_DETAIL.company!,
      name: 'بازرگانی نفیس',
      slug: 'nafis-trading',
      activity: 'بازرگانی',
      province_name: 'اصفهان',
      city_name: 'آزادگان',
      website: 'nafis-trading.ir',
    },
  },
}

export function getStaticAdDetail(id: number | string): StaticAdDetail | null {
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) return null
  return STATIC_AD_DETAILS[numericId] ?? null
}
