import type { ApiError } from "~/types/api";

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
