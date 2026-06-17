export interface InitData {
  enums: InitEnums;
  lookup_data: any;
  //   referenceData: ReferenceData;
  //   config: AppConfig;
}

/**
 * تمام enumها به صورت dynamic از backend می‌آیند
 * هیچ value هاردکد نشده تا mismatch پیش نیاید
 */
export interface InitEnums {
  userType: string[];
  jobStatus: string[];
  employmentTypes: string[];
  genders: string[];
}
