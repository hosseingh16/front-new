import type { RouteLocationRaw } from 'vue-router'
import type { AccountRole } from '~/features/account/types'
import { paths } from '~/routes'
import {
  buildEnteringRoute,
  destinationLocation,
  destinationFullPath,
  enteringFullPath,
} from '~/utils/entering-route'
import { resolvePrimaryRole } from '~/utils/user-role'

export type IntentLocationOptions = {
  to: string
  role?: AccountRole
  query?: Record<string, string>
}

function toLocation(
  to: string,
  query?: Record<string, string>,
): RouteLocationRaw {
  const loc = destinationLocation(to, query)
  return Object.keys(loc.query).length ? loc : loc.path
}

/**
 * Resolve where a CTA should go: guests log in, users without a role
 * pick one via /entering when the click implies a role, and users who
 * already have a role go straight to the destination.
 */
export function useIntentNavigation() {
  const { isAuthenticated } = useSanctumAuth()
  const { user } = useCurrentUser()

  function intentLocation(options: IntentLocationOptions): RouteLocationRaw {
    const hasRole = Boolean(resolvePrimaryRole(user.value))

    if (isAuthenticated.value && hasRole) {
      return toLocation(options.to, options.query)
    }

    if (options.role) {
      if (isAuthenticated.value) {
        return buildEnteringRoute(options)
      }

      return {
        path: paths.login,
        query: { redirect: enteringFullPath(options) },
      }
    }

    if (isAuthenticated.value) {
      return toLocation(options.to, options.query)
    }

    return {
      path: paths.login,
      query: { redirect: destinationFullPath(options.to, options.query) },
    }
  }

  function navigateIntent(options: IntentLocationOptions) {
    return navigateTo(intentLocation(options))
  }

  return { intentLocation, navigateIntent }
}
