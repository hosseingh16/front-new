/** Mirrors App\Enums\AdsRequestStatus values */
export const AdsRequestStatus = {
  PENDING: 3,
  APPROVED: 10,
  REJECTED: 11,
  UNCHECKED: 35,
} as const

export type AdsRequestStatusValue =
  (typeof AdsRequestStatus)[keyof typeof AdsRequestStatus]
