import type { Company, CompanyList } from "./company"

export interface AdList {
    id: number
    company?: CompanyList
    order_id: number
    title: string
    company_logo: string
    company_name: string
    category: string
    city_name: string
    province_name: string
    employment_type: string
    salary: number | string
    salary_range?: string
    gender?: string
    minimum_work_experience?: number | string
    company_advantages?: string
    status: string
    verified: boolean
    expired: boolean
    publish_date: string
    placement?: string
}

export interface Ad {
    id: number
    company?: Company
    order_id: number
    title: string
    company_logo: string
    company_name: string
    company_address?: string
    company_description?: string
    owner_cellphone?: string
    city?: number | string
    city_name?: string
    province?: number | string
    province_name?: string
    employment_type?: string
    salary: number | string
    salary_range?: string
    company_advantages?: string
    job_description?: string
    resume_terms?: string
    minimum_work_experience?: number | string
    gender?: string
    minimum_degree?: string
    company_software?: string
    excel_skill?: boolean
    maliat_skill?: boolean
    bimeh_skill?: boolean
    baha_skill?: boolean
    onsite_days?: number
    onsite_hours?: number
    status: string
    hired?: boolean
    hired_source?: string
    type?: string
    paid?: boolean
    refunded?: boolean
    refundable?: boolean
    verified: boolean
    expired: boolean
    publish_date: string
    created_by?: number | string
    updated_by?: number | string
    deleted_at?: string | null
    created_at?: string
    updated_at?: string
    checked_at?: string
    republish_at?: string
    placement?: string
    republish_count?: number
    has_hesabdar?: boolean
    need_financial_supervisor?: boolean
    need_financial_advisor?: boolean
    work_hours_type?: string
    dynamic_need_days?: number
    dynamic_need_hours?: number
    static_hours?: number
}