import type { ApiError } from "~/types/api";

const RESUME_BASIC_INFO_REQUIRED_MESSAGES = [
  "شما رزومه ندارید",
  "رزومه شما کامل نیست",
] as const;

export function isResumeBasicInfoRequiredError(error: unknown): boolean {
  const message = getApiErrorMessage(error, "");
  return RESUME_BASIC_INFO_REQUIRED_MESSAGES.some((text) =>
    message.includes(text),
  );
}

function hasFilledValue(value: unknown): boolean {
  if (value == null || value === "") return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

export function isResumeBasicInfoComplete(
  user: Record<string, unknown> | null | undefined,
): boolean {
  const personal = user?.resume_personal as
    | Record<string, unknown>
    | null
    | undefined;

  if (!personal) return false;

  return (
    hasFilledValue(personal.city_id) && hasFilledValue(personal.job_title)
  );
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "خطایی رخ داد",
): string {
  if (!error || typeof error !== "object") return fallback;

  const apiError = error as ApiError;

  if (apiError.errors && typeof apiError.errors === "object") {
    for (const value of Object.values(apiError.errors)) {
      const message = Array.isArray(value) ? value[0] : value;
      if (typeof message === "string" && message.trim()) {
        return message;
      }
    }
  }

  if (typeof apiError.message === "string" && apiError.message.trim()) {
    return apiError.message;
  }

  return fallback;
}
