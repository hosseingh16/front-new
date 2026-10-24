import type { FetchResponse } from "ofetch";

export type IdentityOutcome = "auth" | "guest" | "unavailable" | "skipped";

type IdentityStatus = "unverified" | "verified-auth" | "verified-guest";

const HINT_COOKIE = "hihesab_auth";
const EPOCH_KEY = "hihesab_auth_epoch";
const HINT_MAX_AGE = 60 * 60 * 24 * 365;
const INFLIGHT = Symbol("hihesab.auth.identity.inflight");

const UNAVAILABLE_MESSAGE =
  "ارتباط با سرور برقرار نشد. دوباره تلاش کنید.";

type AppWithInflight = ReturnType<typeof useNuxtApp> & {
  [INFLIGHT]?: Promise<IdentityOutcome>;
};

/**
 * Reads the hint. The server looks at the incoming Cookie header only.
 * Assigning this cookie from SSR would add Set-Cookie and can overwrite
 * a login that happened in another tab while the document was in flight.
 */
function cookieHeader(): string {
  if (import.meta.server) {
    return useRequestHeaders(["cookie"]).cookie ?? "";
  }
  return document.cookie;
}

export function readAuthHint(header = cookieHeader()): "0" | "1" | null {
  const match = header.match(/(?:^|;\s*)hihesab_auth=([^;]*)/);
  const value = match?.[1]?.trim();
  if (value === "0" || value === "1") return value;
  return null;
}

function hasSessionCookie(header = cookieHeader()): boolean {
  // The Laravel session cookie is HttpOnly, so only the document request can see it.
  if (import.meta.client) return false;
  return /(?:^|;\s*)[^;=\s]*session=/i.test(header);
}

function currentEpoch(): string {
  if (import.meta.server) return "";
  return localStorage.getItem(EPOCH_KEY) ?? "";
}

function bumpEpoch() {
  if (import.meta.server) return;
  localStorage.setItem(EPOCH_KEY, String(Date.now()));
}

export function writeAuthHint(
  value: "0" | "1",
  options?: { allowDowngrade?: boolean },
) {
  if (import.meta.server) return;
  if (value === "0" && !options?.allowDowngrade && readAuthHint() === "1") {
    return;
  }
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${HINT_COOKIE}=${value}; Path=/; Max-Age=${HINT_MAX_AGE}; SameSite=Lax${secure}`;
}

export function authIdentityUnavailableError() {
  return createError({
    statusCode: 503,
    fatal: true,
    statusMessage: UNAVAILABLE_MESSAGE,
  });
}

export function useAuthIdentity() {
  const status = useState<IdentityStatus>(
    "hihesab.auth.identity",
    () => "unverified",
  );
  const nuxtApp = useNuxtApp() as AppWithInflight;
  const client = useSanctumClient();
  const config = useSanctumConfig();
  const user = useSanctumUser<unknown>();

  function noteAuthenticatedIdentity() {
    status.value = "verified-auth";
    bumpEpoch();
    writeAuthHint("1");
  }

  function noteGuestIdentity() {
    user.value = null;
    status.value = "verified-guest";
    bumpEpoch();
    writeAuthHint("0", { allowDowngrade: true });
  }

  async function requestIdentity(): Promise<IdentityOutcome> {
    const endpoint = config.endpoints.user;
    if (!endpoint) return "unavailable";

    const epochAtStart = currentEpoch();

    try {
      const response = await client.raw<unknown>(endpoint, {
        ignoreResponseError: true,
      });
      return classifyIdentityResponse(response, epochAtStart);
    } catch {
      return "unavailable";
    }
  }

  function classifyIdentityResponse(
    response: FetchResponse<unknown>,
    epochAtStart: string,
  ): IdentityOutcome {
    if (response.ok && response._data != null) {
      if (import.meta.client && currentEpoch() !== epochAtStart) {
        return user.value != null ? "auth" : "guest";
      }
      user.value = response._data;
      status.value = "verified-auth";
      bumpEpoch();
      writeAuthHint("1");
      return "auth";
    }

    // Same split as nuxt-auth-sanctum initialIdentityLoad: only 401 and 419
    // mean "no session". Other statuses and thrown errors stay unverified.
    if (response.status === 401 || response.status === 419) {
      user.value = null;
      status.value = "verified-guest";
      // A login in another tab bumps the epoch while this request is open.
      // Keep its hint. An unchanged epoch means this 401 is the latest result.
      if (import.meta.server || currentEpoch() === epochAtStart) {
        writeAuthHint("0", { allowDowngrade: true });
      }
      return "guest";
    }

    return "unavailable";
  }

  function startRequest(): Promise<IdentityOutcome> {
    const pending = inflightOf(nuxtApp);
    if (pending) return pending;

    let request!: Promise<IdentityOutcome>;
    request = requestIdentity().finally(() => {
      if (nuxtApp[INFLIGHT] === request) nuxtApp[INFLIGHT] = undefined;
    });
    nuxtApp[INFLIGHT] = request;
    return request;
  }

  async function ensureIdentity(options?: {
    force?: boolean;
    ignoreGuestHint?: boolean;
  }): Promise<IdentityOutcome> {
    const pending = inflightOf(nuxtApp);
    if (pending) return pending;

    if (options?.force) return startRequest();

    if (user.value != null || status.value === "verified-auth") {
      status.value = "verified-auth";
      writeAuthHint("1");
      return "auth";
    }

    if (status.value === "verified-guest") {
      // A hint of 1 that appeared after this payload was rendered (other tab
      // logged in) is not a guest proof. Only the browser may retry, and not
      // during hydration, so the first client render still matches SSR.
      if (import.meta.client) {
        const loggedInHint = readAuthHint() === "1";
        const hydrating = nuxtApp.isHydrating === true;
        if (loggedInHint && !hydrating) {
          status.value = "unverified";
        } else {
          if (!loggedInHint) writeAuthHint("0");
          return "guest";
        }
      } else {
        return "guest";
      }
    }

    if (!options?.ignoreGuestHint) {
      const hint = readAuthHint();
      if (hint === "0") return "skipped";
      if (hint !== "1" && !hasSessionCookie()) return "skipped";
    }

    return startRequest();
  }

  return {
    status,
    ensureIdentity,
    noteAuthenticatedIdentity,
    noteGuestIdentity,
    unavailableMessage: UNAVAILABLE_MESSAGE,
  };
}

function inflightOf(nuxtApp: AppWithInflight) {
  return nuxtApp[INFLIGHT];
}
