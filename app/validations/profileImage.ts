import * as Yup from 'yup';

/** Validates a freshly selected File before upload. Photo is optional. */
export const profileImageFileValidation = Yup.mixed()
  .nullable()
  .notRequired()
  .test('is-file', 'فقط فایل مجاز است', (v) => v == null || v instanceof File)
  .test('file-type', 'فقط png و jpg مجاز است', (v) => {
    if (!(v instanceof File)) return true;

    return (
      v.type.startsWith('image/png') ||
      v.type.startsWith('image/jpeg')
    );
  })
  .test('file-size', 'حجم تصویر نباید بیشتر از 10MB باشد', (v) => {
    if (!(v instanceof File)) return true;

    return v.size <= 10 * 1024 * 1024;
  });

/**
 * Profile photo is optional. Upload happens immediately on select,
 * independent of save-basics.
 */
export const profileImageValidation = Yup.mixed().nullable().notRequired();
