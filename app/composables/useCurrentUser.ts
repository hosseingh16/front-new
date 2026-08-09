import { resolveAvatarUrl } from "~/libs/utils";
import { isEmployerUser, isJobSeekerUser } from "~/utils/user-role";

/**
 * Resolves the authenticated user payload from nuxt-auth-sanctum.
 * API shape is usually `{ data: { name, ... } }` but may also be flat.
 */
export function useCurrentUser() {
  const sanctumUser = useSanctumUser<any>();
  const config = useRuntimeConfig();

  const user = computed(() => {
    const raw = sanctumUser.value;
    if (!raw || typeof raw !== "object") return null;

    const root = raw as Record<string, unknown>;
    if (root.data && typeof root.data === "object") {
      return root.data as Record<string, unknown>;
    }

    return root;
  });

  const name = computed(() => {
    const personal = user.value?.resume_personal as
      | Record<string, unknown>
      | null
      | undefined;
    const value = user.value?.name ?? personal?.name;
    if (typeof value !== "string") return "—";
    const trimmed = value.trim();
    return trimmed || "—";
  });

  const avatar = computed(() => {
    const value =
      user.value?.avatar ??
      user.value?.profile_image ??
      user.value?.profileImage;
    return resolveAvatarUrl(value, config.public.baseUrl as string);
  });

  const cellphone = computed(() => {
    const value =
      user.value?.cellphone ??
      user.value?.phone ??
      user.value?.username ??
      user.value?.mobile;
    if (typeof value !== "string" && typeof value !== "number") return "—";
    const trimmed = String(value).trim();
    return trimmed || "—";
  });

  const isEmployer = computed(() => isEmployerUser(user.value));
  const isJobSeeker = computed(() => isJobSeekerUser(user.value));

  function applyUserPayload(payload: unknown) {
    if (!payload || typeof payload !== "object") return;

    const root = payload as Record<string, unknown>;
    const current =
      sanctumUser.value && typeof sanctumUser.value === "object"
        ? (sanctumUser.value as Record<string, unknown>)
        : {};

    if (root.data && typeof root.data === "object") {
      const currentData =
        current.data && typeof current.data === "object"
          ? (current.data as Record<string, unknown>)
          : {};

      sanctumUser.value = {
        ...current,
        ...root,
        data: {
          ...currentData,
          ...(root.data as Record<string, unknown>),
        },
      };
      return;
    }

    const currentData =
      current.data && typeof current.data === "object"
        ? (current.data as Record<string, unknown>)
        : {};

    sanctumUser.value = {
      ...current,
      data: {
        ...currentData,
        ...root,
      },
    };
  }

  /** Shallow-merge fields into the current user `data` object. */
  function patchUser(fields: Record<string, unknown>) {
    const current = sanctumUser.value;
    if (!current || typeof current !== "object") {
      sanctumUser.value = { data: fields };
      return;
    }

    const root = current as Record<string, unknown>;
    if (root.data && typeof root.data === "object") {
      sanctumUser.value = {
        ...root,
        data: {
          ...(root.data as Record<string, unknown>),
          ...fields,
        },
      };
      return;
    }

    sanctumUser.value = {
      ...root,
      ...fields,
    };
  }

  async function refreshUser() {
    const api = useApi();

    try {
      const result = await api.get<any>("/user");
      applyUserPayload(result);
    } catch {
      // Keep the current user if refresh fails.
    }
  }

  return {
    sanctumUser,
    user,
    name,
    avatar,
    cellphone,
    isEmployer,
    isJobSeeker,
    applyUserPayload,
    patchUser,
    refreshUser,
  };
}
