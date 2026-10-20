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
    title?: string
    category?: string
    type?: string
    desc?: string
    scopes?: string | string[]
    needs_presence?: boolean
    min_time?: number
    max_time?: number
    min_budget?: number | string
    max_budget?: number | string
    /** Pre-formatted budget label from API (e.g. "25 میلیون - 50 میلیون") */
    budget?: string | null
    payable_price?: number
    paid_at?: string
    publish_date?: string
    created_at?: string
    status?: string
    has_applied?: boolean
    is_bookmarked?: boolean
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
    min_budget?: number | string
    max_budget?: number | string
    /** Pre-formatted budget label from API (e.g. "25 میلیون - 50 میلیون") */
    budget?: string | null
    payable_price?: number
    paid_at?: string
    status?: string
    is_bookmarked?: boolean
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