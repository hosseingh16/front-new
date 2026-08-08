/**
 * Resolves the authenticated user payload from nuxt-auth-sanctum.
 * API shape is usually `{ data: { name, ... } }` but may also be flat.
 */
export function useCurrentUser() {
  const sanctumUser = useSanctumUser<any>();

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
    const value = user.value?.name;
    if (typeof value !== "string") return "—";
    const trimmed = value.trim();
    return trimmed || "—";
  });

  const avatar = computed(() => {
    const value =
      user.value?.avatar ??
      user.value?.profile_image ??
      user.value?.profileImage;
    return typeof value === "string" && value.trim() ? value.trim() : null;
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

  function applyUserPayload(payload: unknown) {
    if (!payload || typeof payload !== "object") return;

    const root = payload as Record<string, unknown>;

    if (root.data && typeof root.data === "object") {
      sanctumUser.value = root;
      return;
    }

    sanctumUser.value = {
      ...(sanctumUser.value && typeof sanctumUser.value === "object"
        ? sanctumUser.value
        : {}),
      data: root,
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
    applyUserPayload,
    refreshUser,
  };
}
