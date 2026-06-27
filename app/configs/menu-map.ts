type MenuMeta = {
  label: string
  icon: string
  to: string
}

export const menuMap: Record<string, MenuMeta> = {
  // -------------------------
  // Dashboard
  // -------------------------
  dashboard: {
    label: 'پیشخوان',
    icon: 'gauge-1',
    to: '/dashboard',
  },

  // -------------------------
  // JobSeeker Sidebar Items
  // -------------------------
  my_resume: {
    label: 'رزومه من',
    icon: 'work-history',
    to: '/dashboard/my-resume',
  },

  resume_view: {
    label: 'مشاهده رزومه',
    icon: 'eye',
    to: '/dashboard/my-resume',
  },

  resume_edit: {
    label: 'ویرایش رزومه',
    icon: 'eye',
    to: '/dashboard/my-resume/edit',
  },

   ads: {
    label: 'فرصت های شغلی',
    icon: 'eye',
    to: '/dashboard/ads',
  },
   my_requests: {
    label: 'درخواست های من',
    icon: 'eye',
    to: '/dashboard/ads',
  },
   projects: {
    label: 'پروژه ها',
    icon: 'eye',
    to: '/dashboard/ads',
  },
   saved_jobs: {
    label: 'نشان شده ها',
    icon: 'eye',
    to: '/dashboard/ads',
  },

  // -------------------------
  // JobSeeker Dashboard Shortcuts
  // -------------------------

   shortcut_ads: {
    label: 'فرصت های شغلی',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   shortcut_my_requests: {
    label: 'درخواست های من',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   shortcut_my_resume: {
    label: 'مشاهده رزومه',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   shortcut_edit_resume: {
    label: 'رزومه ساز',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   shortcut_saved_jobs: {
    label: 'نشان شده ها',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },

  // -------------------------
  // JobSeeker Quick Menu 
  // -------------------------
  
  //Nothing at the moment



  // -------------------------
  // Employer Sidebar Items
  // -------------------------
   my_ads: {
    label: 'آگهی های من',
    icon: 'eye',
    to: '/jobs/applied',
  },
  create_ad: {
    label: 'ایجاد آگهی جدید',
    icon: 'eye',
    to: '/jobs/applied',
  },
  manage_ads: {
    label: 'مدیریت آگهی‌ها',
    icon: 'eye',
    to: '/jobs/manage-ads',
  },

   my_projects: {
    label: 'پروژه های من',
    icon: 'eye',
    to: '/jobs/applied',
  },
   create_project: {
    label: 'ایجاد پروژه',
    icon: 'eye',
    to: '/jobs/applied',
  },

  ad_management: {
    label: 'مدیریت آگهی‌ها',
    icon: 'bookmark-1',
    to: '/jobs/bookmarked',
  },
   project_management: {
    label: 'مدیریت پروژه ها',
    icon: 'bookmark-1',
    to: '/jobs/bookmarked',
  },
  edit_company: {
    label: 'ویرایش اطلاعات شرکت',
    icon: 'bookmark-1',
    to: '/jobs/bookmarked',
  }, 

  // -------------------------
  // Employer Dashboard Shortcuts
  // -------------------------
  
  shortcut_create_ad: {
    label: 'ایجاد آگهی جدید',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
  shortcut_create_project: {
    label: 'ایجاد پروژه',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
  shortcut_manage_ads: {
    label: 'مدیریت آگهی‌ها',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
  shortcut_manage_projects: {
    label: 'مدیریت پروژه ها',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
  shortcut_edit_company: {
    label: 'ویرایش اطلاعات شرکت',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },

  // -------------------------
  // Employer Quick Menu 
  // -------------------------

  quick_create_fulltime_ad: {
    label: 'ایجاد آگهی تمام وقت',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
  quick_create_parttime_ad: {
    label: 'ایجاد آگهی پاره وقت',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
  quick_create_project: {
    label: 'ایجاد پروژه',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },

  // -------------------------
  // User Avatar DropDown Menu
  // -------------------------

  //For Employer
   user_dashboard: {
    label: 'پیشخوان',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_create_ad: {
    label: 'ایجاد آگهی',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_manage_ads: {
    label: 'مدیریت آگهی‌ها',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_create_project: {
    label: 'ایجاد پروژه',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_manage_projects: {
    label: ' مدیریت پروژه ها',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_edit_company: {
    label: 'ویرایش اطلاعات شرکت',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },

  //For JobSeeker
   user_my_resume: {
    label: 'رزومه من',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_edit_resume: {
    label: 'ویرایش رزومه',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_requests: {
    label: 'درخواست‌های من',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_projects: {
    label: 'پروژه‌های من',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },
   user_saved_jobs: {
    label: 'نشان شده‌ها',
    icon: 'eye',
    to: '/dashboard/my-requests',
  },

  // -------------------------
  // Organization (future use)
  // -------------------------
  organization_resume: {
    label: 'رزومه سازمان',
    icon: 'buildings-5',
    to: '/resumes/org',
  },
} as const