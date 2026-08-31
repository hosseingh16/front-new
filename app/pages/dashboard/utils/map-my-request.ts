import type { MyRequest, MyRequestStatus } from "~/types/my-request";
import { AdsRequestStatus } from "~/utils/ads-request-status";

export interface JobSeekerAdsRequestApi {
  id: number;
  ad_id: number;
  job_title?: string;
  company_name?: string;
  company_logo?: string | null;
  company_website?: string | null;
  category?: string | null;
  province_name?: string | null;
  city_name?: string | null;
  employment_type?: string | null;
  ad_type?: string | null;
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

export function mapJobSeekerAdsRequestToMyRequest(
  item: JobSeekerAdsRequestApi,
): MyRequest {
  return {
    id: item.id,
    ad_id: item.ad_id,
    job_title: item.job_title?.trim() || "بدون عنوان",
    company_name: item.company_name?.trim() || "بدون نام شرکت",
    company_logo: item.company_logo ?? undefined,
    company_website: asOptionalString(item.company_website),
    category: item.category ?? undefined,
    province_name: item.province_name ?? undefined,
    city_name: item.city_name ?? undefined,
    employment_type: item.employment_type ?? undefined,
    ad_type: asOptionalString(item.ad_type),
    salary: item.salary ?? undefined,
    gender: item.gender ?? undefined,
    minimum_work_experience: asOptionalString(item.minimum_work_experience),
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
