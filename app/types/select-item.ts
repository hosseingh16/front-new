export interface ISelectItem {
  label: string;
  value: string | number;
  /** Accounting program type from Const programs: 0 = no subsystems, 1 = has subsystems */
  type?: number;
  /** Canonical URL slug (e.g. provinces: "tehran") */
  slug?: string;
  /** When true, province gets a dedicated /jobs/city/:slug page */
  is_featured?: boolean;
}
