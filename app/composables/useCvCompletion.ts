import type { MaybeRefOrGetter } from "vue";
import { computed, toValue } from "vue";
import { hasCustomAvatar } from "~/libs/utils";

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
  const completionItems = computed(() => {
    const data = toValue(user);
    const personal = data?.resume_personal as Record<string, unknown> | null | undefined;

    return [
      {
        label: "اطلاعات پایه",
        complete: isPresent(personal),
        percent: 20,
      },
      {
        label: "اطلاعات تحصیلی",
        complete: hasArrayItems(data?.resume_educations),
        percent: 10,
      },
      {
        label: "سوابق کاری",
        complete: hasArrayItems(data?.resume_priors),
        percent: 15,
      },
      {
        label: "نرم‌افزار حسابداری",
        complete: hasArrayItems(data?.resume_softwares),
        percent: 15,
      },
      {
        label: "مهارت‌ها",
        complete: isPresent(data?.resume_skills),
        percent: 10,
      },
      {
        label: "ارزیابی بیمه‌ای و مالیاتی",
        complete: isPresent(data?.resume_potentials ?? data?.resume_potential),
        percent: 10,
      },
      {
        label: "درباره من",
        complete: hasNonEmptyString(personal?.about),
        percent: 10,
      },
      {
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
