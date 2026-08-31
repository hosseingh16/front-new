export const CV_REQUIRED_FIELDS_MESSAGE =
  "لطفا تمامی فیلد های اجباری را پر نمائید.";

export function useCvFormValidation() {
  const { $toast } = useNuxtApp();

  function notifyRequiredFieldsError(scrollTargetId?: string) {
    $toast.error(CV_REQUIRED_FIELDS_MESSAGE);

    if (!scrollTargetId) return;

    nextTick(() => {
      document
        .getElementById(scrollTargetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return { notifyRequiredFieldsError, CV_REQUIRED_FIELDS_MESSAGE };
}
