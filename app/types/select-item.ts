export interface ISelectItem {
  label: string;
  value: string | number;
  /** Accounting program type from Const programs: 0 = no subsystems, 1 = has subsystems */
  type?: number;
}
