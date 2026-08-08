import { resolveMenuItems } from "~/configs/menu-map";
import type { PanelConfig } from "~/types/panel-config";

const emptyConfig = (): PanelConfig => ({
  navigation: {
    sidebar: [],
    userMenu: [],
    shortcuts: [],
  },
  permissions: [],
});

export const usePanelConfig = () => {
  const api = useApi();

  const rawConfig = useState<PanelConfig>("panel-config", () => ({
    navigation: {
      sidebar: [],
      accountMenu: [],
      dashboardActions: [],
    },
    permissions: [],
  }));

  const initialized = useState("panel-initialized", () => false);

  const fetchMenu = async (force = false) => {
    if (initialized.value && !force) return;

    const res = (await api.get("/panel/bootstrap")) as { panel: PanelConfig };

    rawConfig.value = res.panel;
    initialized.value = true;
  };

  const sidebarMenu = computed(() =>
    resolveMenuItems(rawConfig.value?.navigation?.sidebar),
  );

  const accountMenu = computed(() =>
    resolveMenuItems(rawConfig.value?.navigation?.accountMenu),
  );

  const dashboardActions = computed(() =>
    resolveMenuItems(rawConfig.value?.navigation?.dashboardActions),
  );

  const permissions = computed(() => rawConfig.value?.permissions ?? []);

  return {
    fetchMenu,
    sidebarMenu,
    accountMenu,
    dashboardActions,
    permissions,
  };
};
