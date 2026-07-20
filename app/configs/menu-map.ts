type MenuMeta = {
  label: string
  icon: string
  to: string
  placement?: 'top' | 'bottom'
}

export const menuMap: Record<string, MenuMeta> = {
  // -------------------------
  // Dashboard
  // -------------------------
  dashboard: {
    label: 'پیشخوان',
    icon: 'svg:gauge-1',
    to: '/dashboard',
  },

  // -------------------------
  // JobSeeker Sidebar Items
  // -------------------------
  my_resume: {
    label: 'رزومه من',
    icon: 'svg:work-history',
    to: '/dashboard/my-resume',
    placement: 'bottom',
  },

  resume_view: {
    label: 'مشاهده رزومه',
    icon: 'svg:eye',
    to: '/dashboard/my-resume',
  },

  resume_edit: {
    label: 'ویرایش رزومه',
    icon: 'svg:eye',
    to: '/dashboard/my-resume/edit',
  },

   ads: {
    label: 'فرصت های شغلی',
    icon: 'svg:eye',
    to: '/dashboard/ads',
  },
   my_requests: {
    label: 'درخواست های من',
    icon: 'svg:eye',
    to: '/dashboard/ads',
  },
   projects: {
    label: 'پروژه ها',
    icon: 'svg:folder',
    to: '/dashboard/ads',
  },
   bookmarks: {
    label: 'نشان شده ها',
    icon: 'svg:bookmark-1',
    to: '/dashboard/bookmarks',
    placement: 'bottom',
  },

  // -------------------------
  // JobSeeker Dashboard Shortcuts
  // -------------------------

   shortcut_ads: {
    label: 'فرصت های شغلی',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   shortcut_my_requests: {
    label: 'درخواست های من',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   shortcut_my_resume: {
    label: 'مشاهده رزومه',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   shortcut_edit_resume: {
    label: 'رزومه ساز',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   shortcut_bookmarks: {
    label: 'نشان شده ها',
    icon: 'svg:bookmark-1',
    to: '/dashboard/bookmarks',
  },

  // -------------------------
  // JobSeeker Quick Menu 
  // -------------------------
  
  //Nothing at the moment



  // -------------------------
  // Employer Sidebar Items
  // -------------------------
  emplopyer_ads: {
    label: 'آگهی های من',
    icon: 'lucide:briefcase',
    to: '/dashboard/employer/ads',
  },
  create_ad: {
    label: 'ایجاد آگهی جدید',
    icon: 'svg:add-briefcase',
    to: '/dashboard/employer/ads/create',
  },
  manage_ads: {
    label: 'مدیریت آگهی‌ها',
    icon: 'lucide:briefcase',
    to: '/jobs/manage-ads',
  },

   my_projects: {
    label: 'پروژه های من',
    icon: 'svg:eye',
    to: '/jobs/applied',
  },
   create_project: {
    label: 'ایجاد پروژه',
    icon: 'svg:eye',
    to: '/jobs/applied',
  },

  ad_management: {
    label: 'مدیریت آگهی‌ها',
    icon: 'lucide:briefcase',
    to: '/jobs/bookmarked',
  },
   project_management: {
    label: 'مدیریت پروژه ها',
    icon: 'svg:bookmark-1',
    to: '/jobs/bookmarked',
  },
  edit_company: {
    label: 'ویرایش اطلاعات شرکت',
    icon: 'svg:bookmark-1',
    to: '/jobs/bookmarked',
    placement: 'bottom',
  }, 

  // -------------------------
  // Employer Dashboard Shortcuts
  // -------------------------
  
  shortcut_create_ad: {
    label: 'ایجاد آگهی جدید',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
  shortcut_create_project: {
    label: 'ایجاد پروژه',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
  shortcut_manage_ads: {
    label: 'مدیریت آگهی‌ها',
    icon: 'lucide:briefcase',
    to: '/dashboard/my-requests',
  },
  shortcut_manage_projects: {
    label: 'مدیریت پروژه ها',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
  shortcut_edit_company: {
    label: 'ویرایش اطلاعات شرکت',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },

  // -------------------------
  // Employer Quick Menu 
  // -------------------------

  quick_create_fulltime_ad: {
    label: 'ایجاد آگهی تمام وقت',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
  quick_create_parttime_ad: {
    label: 'ایجاد آگهی پاره وقت',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
  quick_create_project: {
    label: 'ایجاد پروژه',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },

  // -------------------------
  // User Avatar DropDown Menu
  // -------------------------

  //For Employer
   user_dashboard: {
    label: 'پیشخوان',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   user_create_ad: {
    label: 'ایجاد آگهی',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   user_manage_ads: {
    label: 'مدیریت آگهی‌ها',
    icon: 'lucide:briefcase',
    to: '/dashboard/my-requests',
  },
   user_create_project: {
    label: 'ایجاد پروژه',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   user_manage_projects: {
    label: ' مدیریت پروژه ها',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   user_edit_company: {
    label: 'ویرایش اطلاعات شرکت',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },

  //For JobSeeker
   user_my_resume: {
    label: 'رزومه من',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   user_edit_resume: {
    label: 'ویرایش رزومه',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   user_requests: {
    label: 'درخواست‌های من',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
   user_projects: {
    label: 'پروژه‌های من',
    icon: 'svg:eye',
    to: '/dashboard/my-requests',
  },
  user_bookmarks: {
    label: 'نشان شده‌ها',
    icon: 'svg:bookmark-1',
    to: '/dashboard/bookmarks',
    placement: 'bottom',
  },

  // -------------------------
  // Organization (future use)
  // -------------------------
  organization_resume: {
    label: 'پروفایل سازمان',
    icon: 'svg:buildings-5',
    to: '/dashboard/employer/company',
    placement: 'bottom',
  },
} as const