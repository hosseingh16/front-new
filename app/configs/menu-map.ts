import type { BackendMenuItem, MenuItem, PanelConfig } from "~/types/panel-config";

type MenuMeta = {
  label: string;
  icon: string;
  to: string;
  placement?: "top" | "bottom";
  dashboardIcon?: string;
  dashboardSubtitle?: string;
};

export const menuMap: Record<string, MenuMeta> = {
  dashboard: {
    label: "پیشخوان",
    icon: "svg:gauge-1",
    to: "/dashboard",
  },

  my_resume: {
    label: "رزومه من",
    icon: "svg:work-history",
    to: "/dashboard/my-resume",
    placement: "bottom",
  },

  resume_view: {
    label: "مشاهده رزومه",
    icon: "svg:eye",
    to: "/dashboard/my-resume",
  },

  resume_edit: {
    label: "ویرایش رزومه",
    icon: "svg:edit",
    to: "/dashboard/cv",
  },

  ads: {
    label: "فرصت های شغلی",
    icon: "svg:bag-1",
    to: "/dashboard/ad",
  },

  my_requests: {
    label: "درخواست های من",
    icon: "svg:receive-briefcase",
    to: "/dashboard/my-requests",
  },

  projects: {
    label: "پروژه ها",
    icon: "svg:projects",
    to: "/dashboard/ad",
  },

  bookmarks: {
    label: "نشان شده ها",
    icon: "svg:bookmark-1",
    to: "/dashboard/bookmarks",
    placement: "bottom",
  },

  emplopyer_ads: {
    label: "آگهی های من",
    icon: "lucide:briefcase",
    to: "/dashboard/employer/ads",
  },

  create_ad: {
    label: "ایجاد آگهی جدید",
    icon: "svg:add-briefcase",
    to: "/dashboard/employer/ads/create",
  },

  manage_ads: {
    label: "مدیریت آگهی‌ها",
    icon: "lucide:briefcase",
    to: "/dashboard/employer/ads",
  },

  tax_returns: {
    label: "درخواست های اظهارنامه",
    icon: "lucide:notepad-text",
    to: "/dashboard/tax-returns",
  },

  create_tax_return: {
    label: "ثبت درخواست اظهارنامه",
    icon: "lucide:file-plus-corner",
    to: "/dashboard/tax-returns/create",
  },

  tax_return_management: {
    label: "درخواست های من",
    icon: "lucide:history",
    to: "/dashboard/tax-returns",
  },

  organization_resume: {
    label: "پروفایل سازمان",
    icon: "svg:buildings-5",
    to: "/dashboard/employer/company",
    placement: "bottom",
  },

  user_dashboard: {
    label: "پیشخوان",
    icon: "svg:gauge-1",
    to: "/dashboard",
  },

  user_create_ad: {
    label: "ایجاد آگهی",
    icon: "svg:add-briefcase",
    to: "/dashboard/employer/ads/create",
  },

  user_manage_ads: {
    label: "مدیریت آگهی‌ها",
    icon: "lucide:briefcase",
    to: "/dashboard/employer/ads",
  },

  user_create_project: {
    label: "ایجاد پروژه",
    icon: "svg:projects",
    to: "/dashboard/ad",
  },

  user_manage_projects: {
    label: "مدیریت پروژه ها",
    icon: "svg:projects",
    to: "/dashboard/ad",
  },

  user_edit_company: {
    label: "ویرایش اطلاعات شرکت",
    icon: "svg:buildings-5",
    to: "/dashboard/employer/company",
  },

  user_my_resume: {
    label: "رزومه من",
    icon: "svg:work-history",
    to: "/dashboard/my-resume",
  },

  user_edit_resume: {
    label: "ویرایش رزومه",
    icon: "svg:edit",
    to: "/dashboard/cv",
  },

  user_ads: {
    label: "فرصت های شغلی",
    icon: "svg:bag-1",
    to: "/dashboard/ad",
  },

  user_requests: {
    label: "درخواست‌های من",
    icon: "svg:receive-briefcase",
    to: "/dashboard/my-requests",
  },

  user_projects: {
    label: "پروژه‌های من",
    icon: "svg:projects",
    to: "/dashboard/ad",
  },

  user_bookmarks: {
    label: "نشان شده‌ها",
    icon: "svg:bookmark-1",
    to: "/dashboard/bookmarks",
    placement: "bottom",
  },

  user_settings: {
    label: "تنظیمات",
    icon: "svg:settings",
    to: "/dashboard/settings",
    placement: "bottom",
  },

  dashboard_action_opportunities: {
    label: "فرصت‌های شغلی",
    icon: "svg:illust-job-user",
    dashboardIcon: "svg:illust-job-user",
    to: "/dashboard/ad",
  },

  dashboard_action_create_fulltime_ad: {
    label: "آگهی تمام‌وقت",
    icon: "svg:illust-create-job",
    dashboardIcon: "svg:illust-create-job",
    to: "/dashboard/employer/ads/create?employment_type=full_time",
  },

  dashboard_action_create_parttime_ad: {
    label: "آگهی نیمه‌وقت",
    icon: "svg:illust-create-bag",
    dashboardIcon: "svg:illust-create-bag",
    to: "/dashboard/employer/ads/create?employment_type=part_time",
  },

  dashboard_action_accounting_project: {
    label: "پروژه حسابداری",
    icon: "svg:illust-project-user",
    dashboardIcon: "svg:illust-project-user",
    dashboardSubtitle: "به زودی",
    to: "",
  },

  dashboard_action_consulting: {
    label: "نوبت مشاوره",
    icon: "svg:illust-consulting-user",
    dashboardIcon: "svg:illust-consulting-user",
    dashboardSubtitle: "به زودی",
    to: "",
  },

  dashboard_action_ads: {
    label: "فرصت‌های شغلی",
    icon: "svg:illust-job-user",
    dashboardIcon: "svg:illust-job-user",
    to: "/dashboard/ad",
  },

  dashboard_action_my_requests: {
    label: "درخواست‌های من",
    icon: "svg:receive-briefcase",
    dashboardIcon: "svg:illust-job-user",
    to: "/dashboard/my-requests",
  },

  dashboard_action_my_resume: {
    label: "مشاهده رزومه",
    icon: "svg:work-history",
    dashboardIcon: "svg:illust-create-account",
    to: "/dashboard/my-resume",
  },

  dashboard_action_edit_resume: {
    label: "رزومه ساز",
    icon: "svg:edit",
    dashboardIcon: "svg:illust-create-account",
    to: "/dashboard/cv",
  },

  dashboard_action_bookmarks: {
    label: "نشان شده‌ها",
    icon: "svg:bookmark-1",
    dashboardIcon: "svg:illust-create-account",
    to: "/dashboard/bookmarks",
  },

  dashboard_action_notifications: {
    label: "اعلان‌ها",
    icon: "svg:bell",
    dashboardIcon: "svg:bell",
    dashboardSubtitle: "به زودی",
    to: "",
  },
} as const;

export function resolveMenuItem(item: BackendMenuItem): MenuItem | null {
  const meta = menuMap[item.key];
  if (!meta) return null;

  const disabled = item.enabled === false;
  const children = item.children
    ?.map(resolveMenuItem)
    .filter(Boolean) as MenuItem[] | undefined;

  return {
    key: item.key,
    label: meta.label,
    icon: meta.icon,
    to: meta.to,
    placement: meta.placement ?? "top",
    disabled,
    dashboardIcon: meta.dashboardIcon,
    dashboardSubtitle: meta.dashboardSubtitle,
    children: children?.length ? children : undefined,
  };
}

export function resolveMenuItems(items: BackendMenuItem[] = []): MenuItem[] {
  return items.map(resolveMenuItem).filter(Boolean) as MenuItem[];
}
