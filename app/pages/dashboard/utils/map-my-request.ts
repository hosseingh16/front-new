import type { MyRequest, MyRequestKind, MyRequestStatus } from "~/types/my-request";
import { AdsRequestStatus } from "~/utils/ads-request-status";
import { getProjectCategoryLabel } from "~/data/project-types";
import {
  formatProjectTimeRange,
  formatTomanBudgetRange,
} from "~/utils/project-display";

export interface JobSeekerAdsRequestApi {
  id: number;
  type?: MyRequestKind | string;
  ad_id?: number;
  project_id?: number;
  job_title?: string;
  company_name?: string;
  company_logo?: string | null;
  company_website?: string | null;
  category?: string | null;
  province_name?: string | null;
  city_name?: string | null;
  employment_type?: string | null;
  ad_type?: string | null;
  project_type?: string | null;
  scopes?: string | string[] | null;
  min_time?: number | null;
  max_time?: number | null;
  min_budget?: number | string | null;
  max_budget?: number | string | null;
  budget?: string | null;
  salary?: string | null;
  gender?: string | null;
  minimum_work_experience?: string | number | null;
  minimum_degree?: string | null;
  publish_date?: string | null;
  status: number;
  status_label?: string | null;
  seen?: boolean;
  reject_reasons?: string | null;
  reject_description?: string | null;
  requested_at?: string | null;
  checked_at?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  is_bookmarked?: boolean;
}

export function mapAdsRequestStatusToMyRequestStatus(
  status: number,
  _seen = false,
): MyRequestStatus {
  switch (status) {
    case AdsRequestStatus.APPROVED:
      return "interview";
    case AdsRequestStatus.REJECTED:
      return "rejected";
    case AdsRequestStatus.PENDING:
      // Employer has opened the resume — show under «در حال بررسی»
      return "priority";
    case AdsRequestStatus.UNCHECKED:
    default:
      return "sent";
  }
}

function asOptionalString(
  value: string | number | null | undefined,
): string | undefined {
  if (value == null) return undefined;
  const normalized = String(value).trim();
  return normalized || undefined;
}

function resolveRequestKind(item: JobSeekerAdsRequestApi): MyRequestKind {
  if (item.type === "project" || item.project_id != null) return "project";
  return "ad";
}

function resolveProjectTitle(item: JobSeekerAdsRequestApi): string {
  const title = item.job_title?.trim();
  if (title) {
    return title.startsWith("پروژه") ? title : `پروژه ${title}`;
  }

  const type = item.project_type?.trim();
  if (type) {
    return type.startsWith("پروژه") ? type : `پروژه ${type}`;
  }

  return "پروژه حسابداری";
}

function resolveProjectSalary(item: JobSeekerAdsRequestApi): string | undefined {
  const label =
    asOptionalString(item.budget) ||
    asOptionalString(item.salary) ||
    formatTomanBudgetRange(item.min_budget, item.max_budget) ||
    undefined

  if (!label) return undefined
  return label.includes("تومان") ? label : `${label} تومان`;
}

export function mapJobSeekerAdsRequestToMyRequest(
  item: JobSeekerAdsRequestApi,
): MyRequest {
  const kind = resolveRequestKind(item);
  const isProject = kind === "project";

  return {
    id: item.id,
    type: kind,
    ad_id: item.ad_id,
    project_id: item.project_id,
    job_title: isProject
      ? resolveProjectTitle(item)
      : item.job_title?.trim() || "بدون عنوان",
    company_name: item.company_name?.trim() || "بدون نام شرکت",
    company_logo: item.company_logo ?? undefined,
    company_website: asOptionalString(item.company_website),
    category: isProject
      ? getProjectCategoryLabel(item.category) || undefined
      : item.category ?? undefined,
    province_name: item.province_name ?? undefined,
    city_name: item.city_name ?? undefined,
    employment_type: isProject
      ? "پروژه"
      : item.employment_type ?? undefined,
    ad_type: asOptionalString(item.ad_type),
    project_type: asOptionalString(item.project_type ?? item.job_title),
    scopes: item.scopes ?? undefined,
    min_time: item.min_time ?? null,
    max_time: item.max_time ?? null,
    min_budget: item.min_budget ?? null,
    max_budget: item.max_budget ?? null,
    salary: isProject
      ? resolveProjectSalary(item)
      : item.salary ?? undefined,
    gender: item.gender ?? undefined,
    minimum_work_experience: isProject
      ? formatProjectTimeRange(item.min_time, item.max_time) || undefined
      : asOptionalString(item.minimum_work_experience),
    minimum_degree: asOptionalString(item.minimum_degree),
    publish_date: item.publish_date ?? undefined,
    status: mapAdsRequestStatusToMyRequestStatus(
      item.status,
      Boolean(item.seen),
    ),
    reject_reasons: asOptionalString(item.reject_reasons),
    reject_description: asOptionalString(item.reject_description),
    requested_at: item.requested_at ?? undefined,
    checked_at: item.checked_at ?? undefined,
    updated_at: item.updated_at ?? undefined,
    created_at: item.created_at ?? "",
    is_bookmarked: Boolean(item.is_bookmarked),
  };
}
