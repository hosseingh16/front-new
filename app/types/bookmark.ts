import type { AdList } from '~/types/ad'
import type { ProjectList } from '~/types/project'
import type { CompanyList } from '~/types/company'

export type BookmarkTab =
  | 'ad'
  | 'project'
  | 'company'
  | 'user'
  | 'consultant'

export interface BookmarkEntry<T> {
  model: T
  created_at?: string
}

export interface BookmarkedUser {
  id: number
  name?: string
  avatar?: string | null
  job_title?: string
  wanted_job?: string
  employment_type?: string
  salary_range?: string
  desired_salary?: string
  work_experience?: string
  age?: string | number
  province_name?: string
  city_name?: string
}

export interface BookmarkedCompany extends CompanyList {
  id?: number
  active_ads?: number
}

export interface BookmarksData {
  ad: BookmarkEntry<AdList>[]
  project: BookmarkEntry<ProjectList>[]
  company: BookmarkEntry<BookmarkedCompany>[]
  user: BookmarkEntry<BookmarkedUser>[]
  consultant: BookmarkEntry<BookmarkedUser>[]
}

export function emptyBookmarksData(): BookmarksData {
  return {
    ad: [],
    project: [],
    company: [],
    user: [],
    consultant: [],
  }
}

export function countBookmarks(data: BookmarksData) {
  return (
    data.ad.length +
    data.project.length +
    data.company.length +
    data.user.length +
    data.consultant.length
  )
}

export function getBookmarksByTab(data: BookmarksData, tab: BookmarkTab) {
  return data[tab]
}
