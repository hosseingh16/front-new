import type { ApiResponse } from "~/types/api";
import type { ISelectItem } from "~/types/select-item";
import type { TaxReturnActivityType } from "~/types/tax-return-form";
import { TAX_RETURN_ACTIVITY_OPTIONS } from "~/types/tax-return-form";
import {
  IRAN_MOBILE_PATTERN,
  normalizeIranMobile,
} from "~/utils/iran-mobile";

type TaxReturnPayment = {
  redirect_url?: string;
  action?: string;
  payment_id?: number;
} | null;

type StoreTaxReturnResponse = ApiResponse<{
  taxReturn?: unknown;
  payment?: TaxReturnPayment;
}>;

export type TaxReturnLeadErrors = {
  cellphone: string;
  activityType: string;
  financialTurnover: string;
  city: string;
  desc: string;
  acceptedTerms: string;
};

export const TAX_RETURN_TURNOVER_OPTIONS = [
  {
    label: "کمتر از ۳۰ میلیارد",
    value: "under_30b",
  },
  {
    label: "بین ۳۰ تا ۷۵ میلیارد",
    value: "30b_to_75b",
  },
  {
    label: "بیش از ۷۵ میلیارد",
    value: "over_75b",
  },
] as const;

export const TAX_RETURN_LEAD_CITY_OPTIONS: ISelectItem[] = [
  { label: "تهران", value: "تهران" },
  { label: "کرج", value: "کرج" },
  { label: "مشهد", value: "مشهد" },
];

export function useTaxReturnLeadForm() {
  const api = useApi();
  const { $toast } = useNuxtApp();
  const { taxReturnDescMaxLength } = useSettings();
  const { name, cellphone } = useCurrentUser();

  const activityOptions: ISelectItem[] = TAX_RETURN_ACTIVITY_OPTIONS.map(
    (item) => ({
      label: item.label,
      value: item.value,
    }),
  );

  const turnoverOptions: ISelectItem[] = TAX_RETURN_TURNOVER_OPTIONS.map(
    (item) => ({
      label: item.label,
      value: item.value,
    }),
  );

  const cityOptions = TAX_RETURN_LEAD_CITY_OPTIONS;

  const form = reactive({
    cellphone: "",
    activityType: "" as TaxReturnActivityType | "",
    financialTurnover: "",
    city: "",
    desc: "",
    acceptedTerms: false,
    consultantId: null as number | null,
  });

  const errors = reactive<TaxReturnLeadErrors>({
    cellphone: "",
    activityType: "",
    financialTurnover: "",
    city: "",
    desc: "",
    acceptedTerms: "",
  });

  const submitting = ref(false);

  watch(
    () => form.desc,
    (value) => {
      if (value.length > taxReturnDescMaxLength.value) {
        form.desc = value.slice(0, taxReturnDescMaxLength.value);
      }
    },
  );

  function clearErrors() {
    errors.cellphone = "";
    errors.activityType = "";
    errors.financialTurnover = "";
    errors.city = "";
    errors.desc = "";
    errors.acceptedTerms = "";
  }

  function reset() {
    form.cellphone = "";
    form.activityType = "";
    form.financialTurnover = "";
    form.city = "";
    form.desc = "";
    form.acceptedTerms = false;
    form.consultantId = null;
    clearErrors();
  }

  function prefillFromUser() {
    if (!form.cellphone && cellphone.value !== "—") {
      form.cellphone = cellphone.value;
    }
  }

  function validate(options?: { requireTerms?: boolean }) {
    const mobile = normalizeIranMobile(form.cellphone.trim());
    if (!form.cellphone.trim()) {
      errors.cellphone = "شماره تماس الزامی است.";
    } else if (!IRAN_MOBILE_PATTERN.test(mobile)) {
      errors.cellphone = "شماره همراه معتبر نیست.";
    } else {
      errors.cellphone = "";
    }

    errors.activityType = form.activityType ? "" : "نوع فعالیت الزامی است.";
    errors.financialTurnover = form.financialTurnover
      ? ""
      : "میزان گردش مالی الزامی است.";
    errors.city = form.city ? "" : "شهر الزامی است.";

    const desc = form.desc.trim();
    if (!desc) {
      errors.desc = "شرح فعالیت الزامی است.";
    } else if (desc.length > taxReturnDescMaxLength.value) {
      errors.desc = `شرح فعالیت نباید بیشتر از ${taxReturnDescMaxLength.value} کاراکتر باشد.`;
    } else {
      errors.desc = "";
    }

    if (options?.requireTerms) {
      errors.acceptedTerms = form.acceptedTerms
        ? ""
        : "پذیرش شرایط و قوانین الزامی است.";
    } else {
      errors.acceptedTerms = "";
    }

    return !Object.values(errors).some(Boolean);
  }

  const isValid = computed(() => {
    return Boolean(
      form.cellphone.trim() &&
        form.activityType &&
        form.financialTurnover &&
        form.city &&
        form.desc.trim() &&
        form.acceptedTerms,
    );
  });

  async function submit(
    options?: { requireTerms?: boolean },
  ): Promise<"payment" | "success" | false> {
    if (!validate(options)) {
      $toast.error("لطفا فیلدهای الزامی را تکمیل کنید");
      return false;
    }

    submitting.value = true;
    try {
      const payload: Record<string, unknown> = {
        cellphone: normalizeIranMobile(form.cellphone.trim()),
        activity_type: form.activityType,
        financial_turnover: form.financialTurnover,
        city_name: form.city,
        desc: form.desc.trim(),
      };

      if (name.value && name.value !== "—") {
        payload.name = name.value.trim();
      }

      if (form.consultantId != null) {
        payload.consultant_id = form.consultantId;
      }

      const result = await api.post<StoreTaxReturnResponse>(
        "/tax-returns",
        payload,
      );

      const payment = result.data?.payment;
      if (payment?.payment_id) {
        await navigateTo(`/r/${payment.payment_id}`);
        return "payment";
      }

      reset();
      return "success";
    } catch (err: unknown) {
      const apiErrors =
        err && typeof err === "object" && "errors" in err
          ? (err as { errors?: Record<string, string[] | string> }).errors
          : undefined;

      if (apiErrors && typeof apiErrors === "object") {
        const fieldMap: Record<string, keyof TaxReturnLeadErrors> = {
          cellphone: "cellphone",
          activity_type: "activityType",
          financial_turnover: "financialTurnover",
          city_name: "city",
          city: "city",
          desc: "desc",
        };

        for (const [key, value] of Object.entries(apiErrors)) {
          const message = Array.isArray(value) ? value[0] : value;
          const localKey = fieldMap[key];
          if (localKey && typeof message === "string") {
            errors[localKey] = message;
          }
        }
      }

      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "ثبت درخواست با خطا مواجه شد";
      $toast.error(message);
      return false;
    } finally {
      submitting.value = false;
    }
  }

  return {
    form,
    errors,
    submitting,
    isValid,
    activityOptions,
    turnoverOptions,
    cityOptions,
    taxReturnDescMaxLength,
    reset,
    prefillFromUser,
    submit,
  };
}
