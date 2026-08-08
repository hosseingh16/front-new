export type MenuItem = {
  key?: string;
  label: string;
  icon: string;
  to: string;
  placement?: "top" | "bottom";
  disabled?: boolean;
  dashboardIcon?: string;
  dashboardSubtitle?: string;
  children?: MenuItem[];
};

export type BackendMenuItem = {
  key: string;
  enabled?: boolean;
  children?: BackendMenuItem[];
};

export type PanelNavigation = {
  sidebar: BackendMenuItem[];
  accountMenu: BackendMenuItem[];
  dashboardActions: BackendMenuItem[];
};

export type PanelConfig = {
  navigation: PanelNavigation;
  permissions: string[];
};
