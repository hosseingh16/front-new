import type { MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";
import { hasCustomAvatar } from "~/libs/utils";

export type CvCompletionItem = {
  key: string;
  tab: 1 | 2;
  label: string;
  complete: boolean;
  percent: number;
};

function isPresent(value: unknown): boolean {
  return value != null;
}

function hasArrayItems(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

function hasNonEmptyString(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function useCvCompletion(user: MaybeRefOrGetter<Record<string, unknown> | null>) {
  const completionItems = computed((): CvCompletionItem[] => {
    const data = toValue(user);
    const personal = data?.resume_personal as Record<string, unknown> | null | undefined;

    return [
      {
        key: "basic",
        tab: 1,
        label: "اطلاعات پایه",
        complete: isPresent(personal),
        percent: 20,
      },
      {
        key: "education",
        tab: 2,
        label: "اطلاعات تحصیلی",
        complete: hasArrayItems(data?.resume_educations),
        percent: 10,
      },
      {
        key: "experience",
        tab: 2,
        label: "سوابق کاری",
        complete: hasArrayItems(data?.resume_priors),
        percent: 15,
      },
      {
        key: "software",
        tab: 2,
        label: "نرم‌افزار حسابداری",
        complete: hasArrayItems(data?.resume_softwares),
        percent: 15,
      },
      {
        key: "skills",
        tab: 2,
        label: "مهارت‌ها",
        complete: isPresent(data?.resume_skills),
        percent: 10,
      },
      {
        key: "potential",
        tab: 2,
        label: "ارزیابی بیمه‌ای و مالیاتی",
        complete: isPresent(data?.resume_potentials ?? data?.resume_potential),
        percent: 10,
      },
      {
        key: "about",
        tab: 1,
        label: "درباره من",
        complete: hasNonEmptyString(personal?.about),
        percent: 10,
      },
      {
        key: "avatar",
        tab: 1,
        label: "تصویر پروفایل",
        complete: hasCustomAvatar(data?.avatar),
        percent: 10,
      },
    ];
  });

  const totalPercent = computed(() =>
    completionItems.value.reduce(
      (sum, item) => sum + (item.complete ? item.percent : 0),
      0,
    ),
  );

  return {
    completionItems,
    totalPercent,
  };
}
