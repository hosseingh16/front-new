import type { Company, CompanyList } from "./company"
import type { User } from "./user"


export interface Project {
    id: number
    company?: Company
    company_logo: string
    company_name: string
    company_address?: string
    company_description?: string
    owner_cellphone?: string
    company_type?: string
    company_size?: string
    user?: User
    type?: string
    desc?: string
    scopes?: string
    min_time?: number
    max_time?: number
    min_budget?: number
    max_budget?: number
    payable_price?: number
    paid_at?: string
    status?: string
}

export interface ProjectList {
    id: number
    company?: CompanyList
    company_logo: string
    company_name: string
    company_address?: string
    owner_cellphone?: string
    company_type?: string
    company_size?: string
    user_id?: number
    type?: string
    scopes?: string
    min_time?: number
    max_time?: number
    min_budget?: number
    max_budget?: number
    payable_price?: number
    paid_at?: string
    status?: string
}

export interface ProjectSummery {
    id: number
    type: string
    scopes: string
    company_logo: string
    company_name: string
    status: string
    requests_total: number
    requests_unseen: number
    requests_seen: number
    requests_confirmed: number
    requests_rejected: number
}