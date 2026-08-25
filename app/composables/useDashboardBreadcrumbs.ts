import { menuMap } from "~/configs/menu-map";

export type DashboardBreadcrumb = {
  label: string;
  to?: string;
};

const DYNAMIC_ROUTE_LABELS: Array<{
  pattern: RegExp;
  label: string;
  parent: string;
}> = [
  {
    pattern: /^\/dashboard\/employer\/ads\/[^/]+\/edit\/?$/,
    label: "ویرایش آگهی",
    parent: "/dashboard/employer/ads",
  },
  {
    pattern: /^\/dashboard\/employer\/ads\/[^/]+\/resumes\/?$/,
    label: "درخواست‌ها",
    parent: "/dashboard/employer/ads",
  },
  {
    pattern: /^\/dashboard\/ad\/[^/]+\/?$/,
    label: "جزئیات آگهی",
    parent: "/dashboard/ad",
  },
];

function normalizePath(path: string) {
  const withoutQuery = path.split("?")[0] ?? path;
  if (withoutQuery.length > 1 && withoutQuery.endsWith("/")) {
    return withoutQuery.slice(0, -1);
  }
  return withoutQuery;
}

function buildPathLabels() {
  const labels = new Map<string, string>();
  labels.set("/dashboard", "پیشخوان");

  for (const [key, meta] of Object.entries(menuMap)) {
    if (key.startsWith("dashboard_action_")) continue;

    const path = normalizePath(meta.to?.split("?")[0] ?? "");
    if (!path.startsWith("/dashboard") || path === "/dashboard") continue;
    if (!labels.has(path)) labels.set(path, meta.label);
  }

  return labels;
}

const pathLabels = buildPathLabels();

export function useDashboardBreadcrumbs() {
  const route = useRoute();

  const breadcrumbs = computed<DashboardBreadcrumb[]>(() => {
    const path = normalizePath(route.path);
    const dynamic = DYNAMIC_ROUTE_LABELS.find((item) =>
      item.pattern.test(path),
    );
    const lookupPath = dynamic?.parent ?? path;

    const matchedPaths = [...pathLabels.entries()]
      .filter(
        ([candidate]) =>
          lookupPath === candidate || lookupPath.startsWith(`${candidate}/`),
      )
      .sort((a, b) => a[0].length - b[0].length);

    const crumbs: DashboardBreadcrumb[] = matchedPaths.map(
      ([candidate, label], index) => {
        const isLastStatic = !dynamic && index === matchedPaths.length - 1;
        return {
          label,
          to: isLastStatic ? undefined : candidate,
        };
      },
    );

    if (dynamic) {
      crumbs.push({ label: dynamic.label });
    }

    if (!crumbs.length) {
      return [{ label: "پیشخوان" }];
    }

    return crumbs;
  });

  return { breadcrumbs };
}
