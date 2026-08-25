import type { MaybeRef } from "vue";
import type { ApiResponse } from "~/types/api";
import type { UserResume } from "~/types/user-resume";

function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: string }).message);
  }
  return "خطا در دریافت رزومه";
}

export function usePublicCv(slug: MaybeRef<string>) {
  const api = useApi();
  const slugRef = toRef(slug);

  const { data, pending, error: fetchError, status } = useAsyncData(
    () => `cv-public-${slugRef.value}`,
    async () => {
      const value = slugRef.value?.trim();
      if (!value) return null;

      try {
        const result = await api.get<ApiResponse<UserResume>>(`/cv/${value}`);
        return result.data ?? null;
      } catch (err: unknown) {
        const statusCode =
          err && typeof err === "object" && "status" in err
            ? Number((err as { status?: number }).status)
            : undefined;

        if (statusCode === 404) {
          throw createError({
            statusCode: 404,
            statusMessage: "رزومه یافت نشد",
          });
        }

        throw err;
      }
    },
    {
      watch: [slugRef],
    },
  );

  const user = computed(() => data.value ?? null);

  const error = computed(() =>
    fetchError.value ? getFetchErrorMessage(fetchError.value) : null,
  );

  const initialized = computed(
    () => status.value === "success" || status.value === "error",
  );

  return {
    user,
    loading: pending,
    initialized,
    error,
  };
}
