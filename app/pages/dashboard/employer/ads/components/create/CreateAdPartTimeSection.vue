<template>
  <div class="border p-4 border-dashed rounded-lg border-gray-default">
    <Titr>شرایط کار پاره وقت</Titr>

    <div class="mt-4 space-y-6">
      <div>
        <p class="relative mb-3 w-fit text-base">
          نحوه مدیریت حسابداری در سازمان شما:
          <span class="absolute -top-2 text-red-400">*</span>
        </p>

        <div class="grid gap-4 md:grid-cols-2">
          <div
            v-for="group in accountingGroups"
            :key="group.value"
            class="cursor-pointer rounded-xl border p-4 transition-colors"
            :class="
              form.accounting_management === group.value
                ? 'border-primary-500 bg-surface-soft'
                : 'border-transparent bg-surface-50'
            "
            @click="selectAccountingGroup(group.value)"
          >
            <label class="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                class="radio radio-primary"
                name="accounting_management"
                :checked="form.accounting_management === group.value"
                @change="selectAccountingGroup(group.value)"
              />
              <span class="text-sm font-semibold">{{ group.label }}</span>
            </label>

            <div class="mt-3 space-y-3 pr-1">
              <label
                v-for="need in group.needs"
                :key="need"
                class="flex cursor-pointer items-start gap-2"
                @click.stop
              >
                <input
                  v-model="form.accounting_needs"
                  type="checkbox"
                  :value="need"
                  class="checkbox checkbox-primary p-1.5"
                  @change="selectAccountingGroup(group.value)"
                />
                <span class="text-sm leading-6 text-text-secondary">{{
                  need
                }}</span>
              </label>
            </div>
          </div>
        </div>

        <p
          v-if="errors.accounting_management"
          class="mt-1 text-xs text-[#EF4035]"
        >
          {{ errors.accounting_management }}
        </p>
      </div>

      <div>
        <p class="relative mb-3 w-fit text-base">
          نحوه همکاری:
          <span class="absolute -top-2 text-red-400">*</span>
        </p>

        <div class="flex flex-wrap items-center gap-8">
          <label
            v-for="option in collaborationOptions"
            :key="option.value"
            class="flex cursor-pointer items-center gap-2"
          >
            <input
              v-model="form.collaboration_type"
              type="radio"
              class="radio radio-primary"
              name="collaboration_type"
              :value="option.value"
            />
            <span class="text-sm">{{ option.label }}</span>
          </label>
        </div>

        <p v-if="errors.collaboration_type" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.collaboration_type }}
        </p>
      </div>

      <div
        v-if="form.collaboration_type === 'floating'"
        class="grid gap-6 lg:grid-cols-2"
      >
        <div>
          <m-select2
            v-model="form.floating_days"
            label="تعداد روز مورد نیاز:"
            required
            :options="dayCountOptions"
            placeholder="تعداد روز مورد نیاز برای حضور را انتخاب کنید"
            :error="Boolean(errors.floating_days)"
          />
          <p v-if="errors.floating_days" class="mt-1 text-xs text-[#EF4035]">
            {{ errors.floating_days }}
          </p>
        </div>

        <div>
          <m-select2
            v-model="form.floating_hours"
            label="تعداد ساعت مورد نیاز:"
            required
            :options="hourCountOptions"
            placeholder="تعداد ساعت مورد نیاز برای حضور را انتخاب کنید"
            :error="Boolean(errors.floating_hours)"
          />
          <p v-if="errors.floating_hours" class="mt-1 text-xs text-[#EF4035]">
            {{ errors.floating_hours }}
          </p>
        </div>
      </div>

      <div v-else-if="form.collaboration_type === 'fixed'">
        <p class="relative mb-3 w-fit text-base">
          ساعت کاری:
          <span class="absolute -top-2 text-red-400">*</span>
        </p>

        <div class="space-y-3">
          <div
            v-for="day in form.fixed_schedule"
            :key="day.day"
            class="space-y-2"
          >
            <div
              v-for="(range, rangeIndex) in day.ranges"
              :key="rangeIndex"
              class="flex flex-wrap items-center gap-3"
            >
              <label
                class="flex w-28 shrink-0 cursor-pointer items-center gap-2"
                :class="{ invisible: rangeIndex > 0 }"
              >
                <input
                  v-model="day.enabled"
                  type="checkbox"
                  class="checkbox checkbox-primary p-1.5"
                />
                <span class="text-sm">{{ day.day }}</span>
              </label>

              <div class="flex items-center gap-2">
                <span class="shrink-0 text-sm">ساعت شروع از:</span>
                <div class="w-36">
                  <m-select2
                    v-model="range.start"
                    :options="startTimeOptions"
                    placeholder="ساعت شروع"
                    search
                    @update:model-value="onStartTimeChange(day, range)"
                  />
                </div>
              </div>

              <div class="flex items-center gap-2">
                <span class="shrink-0 text-sm">تا:</span>
                <div class="w-36">
                  <m-select2
                    v-model="range.end"
                    :options="endTimeOptions(range)"
                    placeholder="ساعت پایان"
                    search
                    @update:model-value="day.enabled = true"
                  />
                </div>
              </div>

              <button
                v-if="rangeIndex === 0"
                type="button"
                class="btn btn-ghost-primary h-9 w-9 p-0 text-lg font-light"
                aria-label="افزودن بازه زمانی"
                @click="addRange(day)"
              >
                +
              </button>
              <button
                v-else
                type="button"
                class="btn btn-ghost h-9 w-9 p-0 text-lg text-[#EF4035] font-light"
                aria-label="حذف بازه زمانی"
                @click="removeRange(day, rangeIndex)"
              >
                −
              </button>
            </div>
          </div>
        </div>

        <p v-if="errors.fixed_schedule" class="mt-1 text-xs text-[#EF4035]">
          {{ errors.fixed_schedule }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Titr from "~/features/panel/cv/Titr.vue";
import type {
  CreateAdFormErrors,
  CreateAdFormModel,
  PartTimeDaySchedule,
  PartTimeTimeRange,
} from "~/types/create-ad-form";
import type { ISelectItem } from "~/types/select-item";

const props = defineProps<{
  form: CreateAdFormModel;
  errors: CreateAdFormErrors;
}>();

const accountingGroups = [
  {
    value: "has_accountant",
    label: "سازمان دارای حسابدار است.",
    needs: [
      "نیاز به نظارت به سیستم مالی را دارم",
      "نیاز به مشاور مالیاتی به صورت نظارت مستمر را دارم",
    ],
  },
  {
    value: "no_accountant",
    label: "سازمان دارای حسابدار نیست.",
    needs: [
      "نیاز به ارسال گزارشات مالیاتی و بیمه‌ای دارم",
      "نیاز به ثبت رویدادهای مالی و گزارش‌های روزانه دارم",
    ],
  },
] as const;

const collaborationOptions = [
  { value: "floating", label: "ساعت کاری شناور" },
  { value: "fixed", label: "ساعت کاری ثابت" },
] as const;

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toFaDigits(value: number | string) {
  return String(value)
    .split("")
    .map((char) => FA_DIGITS[Number(char)] ?? char)
    .join("");
}

const dayCountOptions: ISelectItem[] = Array.from(
  { length: 7 },
  (_, index) => ({
    value: String(index + 1),
    label: `${toFaDigits(index + 1)} روز در هفته`,
  }),
);

const hourCountOptions: ISelectItem[] = Array.from(
  { length: 12 },
  (_, index) => ({
    value: String(index + 1),
    label: `${toFaDigits(index + 1)} ساعت در روز`,
  }),
);

function selectAccountingGroup(value: string) {
  if (props.form.accounting_management === value) return;

  props.form.accounting_management = value;
  const groupNeeds: readonly string[] =
    accountingGroups.find((group) => group.value === value)?.needs ?? [];
  props.form.accounting_needs = props.form.accounting_needs.filter((need) =>
    groupNeeds.includes(need),
  );
}

const timeOptions: ISelectItem[] = Array.from({ length: 49 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";
  const value = `${String(hour).padStart(2, "0")}:${minute}`;
  return { value, label: toFaDigits(value) };
});

const startTimeOptions = timeOptions.slice(0, -1);

function endTimeOptions(range: PartTimeTimeRange) {
  if (!range.start) return timeOptions.slice(1);
  return timeOptions.filter((option) => String(option.value) > range.start);
}

function onStartTimeChange(day: PartTimeDaySchedule, range: PartTimeTimeRange) {
  day.enabled = true;
  if (range.end && range.end <= range.start) {
    range.end = "";
  }
}

function addRange(day: PartTimeDaySchedule) {
  day.ranges.push({ start: "", end: "" });
  day.enabled = true;
}

function removeRange(day: PartTimeDaySchedule, index: number) {
  day.ranges.splice(index, 1);
}
</script>
