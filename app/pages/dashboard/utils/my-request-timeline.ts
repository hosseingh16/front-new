import type {
  MyRequest,
  MyRequestTimelineEvent,
} from '~/types/my-request'
import { AD_REQUEST_REJECT_REASONS } from '~/utils/employer-ad-request-lookups'

function rejectReasonText(request: MyRequest): string | undefined {
  if (request.reject_description?.trim()) {
    return request.reject_description.trim()
  }

  const raw = request.reject_reasons?.trim()
  if (!raw) return undefined

  const matched = AD_REQUEST_REJECT_REASONS.find(
    (item) => String(item.value) === raw || item.label === raw,
  )

  return matched?.label || raw
}

/**
 * Builds a reverse-chronological status timeline from the request's current state.
 * Exact historical timestamps are not stored per transition, so we fall back to
 * checked_at / updated_at / created_at where available.
 */
export function buildMyRequestTimeline(
  request: MyRequest,
): MyRequestTimelineEvent[] {
  const events: MyRequestTimelineEvent[] = []
  const sentAt = request.requested_at || request.created_at
  const reviewedAt = request.checked_at || request.updated_at || sentAt
  const decidedAt = request.updated_at || reviewedAt

  if (request.status === 'interview') {
    events.push({
      id: 'interview',
      type: 'interview',
      title: 'تایید برای مصاحبه',
      description: 'کارفرما برای هماهنگی‌های مصاحبه با شما تماس می‌گیرد.',
      date: decidedAt,
      actor: 'company',
    })
  }

  if (request.status === 'rejected') {
    const reason = rejectReasonText(request)

    events.push({
      id: 'contact',
      type: 'contact',
      title: 'پشتیبانی های‌حساب',
      description:
        'در صورتی که رزومه شما غیرمنصفانه رد شده است با ما در میان بگذارید.',
      date: decidedAt,
      actor: 'platform',
      showContactCta: true,
    })

    events.push({
      id: 'rejected',
      type: 'rejected',
      title: 'رد شده',
      description: reason
        ? 'کارفرما رزومه شما را به دلایل زیر رد کرد:'
        : 'کارفرما رزومه شما را رد کرد.',
      date: decidedAt,
      actor: 'company',
      rejectReason: reason,
    })
  }

  if (
    request.status === 'priority' ||
    request.status === 'pending' ||
    request.status === 'interview' ||
    request.status === 'rejected'
  ) {
    events.push({
      id: 'reviewing',
      type: 'reviewing',
      title: 'بررسی رزومه شما',
      description:
        'کارفرما رزومه شما رو مشاهده و بررسی کرد. در صورت مطابقت با نیازهای سازمان، کارفرما وضعیت به تأیید برای مصاحبه تغییر خواهد کرد یا در روزهای آینده با شما تماس می‌گیرد.',
      date: reviewedAt,
      actor: 'company',
    })
  }

  events.push({
    id: 'waiting',
    type: 'waiting',
    title: 'در انتظار تعیین وضعیت',
    description:
      'رزومه شما برای کارفرما ارسال شده است، و در انتظار بررسی است.',
    date: sentAt,
    actor: 'platform',
  })

  events.push({
    id: 'sent',
    type: 'sent',
    title: 'ارسال رزومه',
    description: 'رزومه شما برای کارفرما ارسال شده است.',
    date: sentAt,
    actor: 'user',
  })

  return events
}
