export const ogImageSize = {
  width: 1024,
  height: 537,
} as const;

export const ogImages = {
  default: "/images/og/default.jpg",
  jobs: "/images/og/jobs.jpg",
  projects: "/images/og/projects.jpg",
  resumeBuilder: "/images/og/resume-builder.jpg",
  taxReturn: "/images/og/tax-return.jpg",
  employers: "/images/og/employers.jpg",
  blog: "/images/og/blog.jpg",
  jobDetail: "/images/og/job-detail.jpg",
  projectDetail: "/images/og/project-detail.jpg",
} as const;

type OgImage = {
  image: string;
  alt: string;
};

const brandImage: OgImage = {
  image: ogImages.default,
  alt: "پلتفرم تخصصی حسابداری های‌حساب",
};

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function resolveOgImage(path: string): OgImage {
  const current = normalizePath(path);

  if (
    current === "/jobs" ||
    current.startsWith("/jobs/city/") ||
    current.startsWith("/jobs/category/")
  ) {
    return {
      image: ogImages.jobs,
      alt: "استخدام حسابدار در های‌حساب",
    };
  }

  if (/^\/jobs\/\d+(?:\/|$)/.test(current)) {
    return {
      image: ogImages.jobDetail,
      alt: "آگهی استخدام حسابدار",
    };
  }

  if (current === "/projects") {
    return {
      image: ogImages.projects,
      alt: "پروژه‌های حسابداری در های‌حساب",
    };
  }

  if (/^\/project\/\d+(?:\/|$)/.test(current)) {
    return {
      image: ogImages.projectDetail,
      alt: "جزئیات پروژه حسابداری در های‌حساب",
    };
  }

  if (current === "/resume-builder") {
    return {
      image: ogImages.resumeBuilder,
      alt: "رزومه‌ساز تخصصی های‌حساب",
    };
  }

  if (current === "/tax-return") {
    return {
      image: ogImages.taxReturn,
      alt: "تنظیم و ارسال اظهارنامه مالیاتی",
    };
  }

  if (current === "/employers") {
    return {
      image: ogImages.employers,
      alt: "خدمات کارفرمایان در های‌حساب",
    };
  }

  if (current === "/blog" || current.startsWith("/blog/")) {
    return {
      image: ogImages.blog,
      alt: "وبلاگ حسابداری های‌حساب",
    };
  }

  return brandImage;
}
