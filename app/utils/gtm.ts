import type { AccountRole } from "~/features/account/types";

/**
 * Custom-event names configured in Google Tag Manager.
 * These must match the container triggers exactly.
 */
export const GTM_REGISTRATION_EVENTS = {
  employer: "empRegistered",
  job_seeker: "jobseekerRegistration",
} as const satisfies Record<AccountRole, string>;

export type GtmRegistrationEventName =
  (typeof GTM_REGISTRATION_EVENTS)[AccountRole];

/** dataLayer entry. Registration pushes `{ event }` and nothing else. */
export interface GtmDataLayerEvent {
  event: string;
}

declare global {
  interface Window {
    dataLayer?: GtmDataLayerEvent[];
  }
}

type DataLayerTarget = {
  dataLayer?: GtmDataLayerEvent[];
};

/** In-memory only. Never written to dataLayer. */
const pushedRegistrationKeys = new Set<string>();

/**
 * Push a registration event on the client after the role request succeeds.
 * `dedupeKey` is kept in memory so one registration cannot push twice.
 * Returns false during SSR, for an unknown role, or when this key already fired.
 */
export function pushGtmRegistrationEvent(
  role: AccountRole,
  dedupeKey: string,
  target?: DataLayerTarget,
): boolean {
  const layerOwner = resolveDataLayerTarget(target);
  if (!layerOwner) return false;

  const event = GTM_REGISTRATION_EVENTS[role];
  const key = dedupeKey.trim();
  if (!event || !key || pushedRegistrationKeys.has(key)) return false;

  // Claim the key before pushing so overlapping successes cannot both emit.
  pushedRegistrationKeys.add(key);

  try {
    layerOwner.dataLayer = layerOwner.dataLayer || [];
    layerOwner.dataLayer.push({ event });
    return true;
  } catch {
    pushedRegistrationKeys.delete(key);
    return false;
  }
}

function resolveDataLayerTarget(target?: DataLayerTarget) {
  if (target) return target;
  if (!import.meta.client || typeof window === "undefined") return null;
  return window;
}
