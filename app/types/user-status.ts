export interface UserStatusUser {
  id: number
  type: string | null
  roles: string[]
  approved: boolean
  controlled: boolean
  archived: boolean
  cv_visibility: boolean
  is_deactivated: boolean
  deactivate_at: string | null
  deactivate_reason: string | null
  last_login_at: string | null
}

export interface UserStatusProfile {
  completion: number
  has_name: boolean
  has_avatar: boolean
  has_email: boolean
  has_phone: boolean
  has_type: boolean
}

export interface UserStatusResume {
  completion: number
  has_basics: boolean
  has_education: boolean
  has_priors: boolean
  has_skills: boolean
  has_softwares: boolean
  has_potentials: boolean
}

export interface UserStatusCompany {
  exists: boolean
  completion: number
  is_profile_public: boolean
}

export interface UserStatusFlags {
  activity: unknown
  cv_completion: unknown
  has_basic_resume: boolean
  cv_searchable: boolean
  ad_receiver: boolean
  login_count: number
}

export interface UserStatusPayload {
  user: UserStatusUser
  profile: UserStatusProfile
  resume: UserStatusResume
  company: UserStatusCompany
  flags: UserStatusFlags | null
}
