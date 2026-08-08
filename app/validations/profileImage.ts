import * as Yup from 'yup';

/** Validates a freshly selected File before upload. */
export const profileImageFileValidation = Yup.mixed()
  .test('required', 'تصویر انتخاب نشده است', (v) => v != null)
  .test('is-file', 'فقط فایل مجاز است', (v) => v instanceof File)
  .test('file-type', 'فقط png و jpg مجاز است', (v) => {
    if (!(v instanceof File)) return false;

    return (
      v.type.startsWith('image/png') ||
      v.type.startsWith('image/jpeg')
    );
  })
  .test('file-size', 'حجم تصویر نباید بیشتر از 10MB باشد', (v) => {
    if (!(v instanceof File)) return false;

    return v.size <= 10 * 1024 * 1024;
  });

/**
 * Form-field validation after upload: accepts media id / marker string
 * (upload happens immediately; save-basics only needs a present value).
 */
export const profileImageValidation = Yup.mixed().test(
  'required',
  'تصویر انتخاب نشده است',
  (v) => v != null && v !== '',
);
