export type MenuItem = {
  key?: string;
  label: string;
  icon: string;
  to: string;
  placement?: 'top' | 'bottom';
  children?: MenuItem[];
};
