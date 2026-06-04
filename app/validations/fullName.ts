import * as Yup from 'yup';

export const fullNameValidation = Yup.string()
  .min(6, 'نام باید حداقل ۶ کاراکتر باشد')
  .required('نام وارد نشده است')
  .matches(
    /^[\u0600-\u06FF\s]+$/,
    'نام فقط باید شامل حروف فارسی باشد'
  );