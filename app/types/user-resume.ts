export interface UserResumePersonal {
  id?: number
  name?: string
  email?: string
  cellphone?: string
  province_id?: number | string
  province_name?: string
  city_id?: number | string
  city_name?: string
  region_id?: number | string
  region_name?: string
  address?: string
  marital_status?: string
  birthdate?: string | number
  military_service_status?: string
  about?: string
  gender?: string | number
  wanted_job?: string
  job_title?: string
  desired_salary?: string
  salary_range?: string
  job_status?: string
  work_experience?: string
}

export interface UserResumeEducation {
  id: number
  major?: string
  degree?: string
  university?: string
  enddate?: string | number
  stillbusy?: boolean | number
  description?: string
}

export interface UserResumePrior {
  id: number
  title?: string
  company_name?: string
  employment_type?: string
  activity_type?: string
  start_month?: string | number
  start_year?: string | number
  end_month?: string | number
  end_year?: string | number
  still_busy?: boolean | number
  last_salary?: string
  description?: string
}

export interface UserResumeSoftware {
  id: number
  name?: string
  general_skill?: string | number
  naghdobank?: string | number
  anbar?: string | number
  forosh?: string | number
  mali?: string | number
  hoghogh?: string | number
  type?: string
}

export interface UserResumeSkill {
  id: number
  excel_score?: string | number
  flat_cost?: string | number
  contract_accounting?: string | number
  standard_statements?: string | number
}

export interface UserResumePotential {
  id: number
  financial_background?: string | number
  value_added_tax_score?: string | number
  article_169_score?: string | number
  terminals?: string | number
  performance_tax_score?: string | number
  personal_insurance_score?: string | number
  contract_insurance_score?: string | number
  insurance_responsibilities?: string | number
  accounting_section?: string | number
  accounting_softwares?: string | number
  responsibilities?: string | number
  financial_manager?: string | number
  flat_cost?: string | number
  contract_accounting?: string | number
  financial_statements_score?: string | number
  consult_fields?: string | number
}

export interface UserResume {
  id: number
  name: string
  username?: string
  email?: string
  job_title?: string
  company_name?: string
  phone?: string
  avatar?: string | null
  location?: string
  skills?: string
  description?: string
  notes?: string
  resume_file?: string | null
  resume_personal?: UserResumePersonal | null
  resume_educations?: UserResumeEducation[]
  resume_potential?: UserResumePotential | null
  resume_skills?: UserResumeSkill | null
  resume_softwares?: UserResumeSoftware[]
  resume_priors?: UserResumePrior[]
  is_bookmarked?: boolean
}
