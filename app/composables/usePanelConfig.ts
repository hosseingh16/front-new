import { menuMap } from '~/configs/menu-map';
import type { MenuItem } from '~/types/panel-config';

type BackendMenuItem = {
  key: string;
  children?: string[];
};

type PanelConfig = {
  navigation: {
    sidebar: BackendMenuItem[];
  };
  modules: string[];
};

export const usePanelConfig = () => {
  const rawConfig = useState<PanelConfig | null | undefined>('panel-config', () => null);

  const fetchMenu = async () => {
    // const { data } = await useFetch<PanelConfig>('/api/panel-config');
    // rawConfig.value = data.value;

    rawConfig.value = {
      navigation: {
        sidebar: [
          { key: 'dashboard' },
          {
            key: 'job-resumes',
            children: ['my-resume', 'organization-resume'],
          },
          { key: 'jobs', children: ['bookmarked-jobs', 'applied-jobs'] },
          { key: 'projects' },
        ],
      },
      modules: [],
    };
  };

  const sidebarMenu = computed<MenuItem[]>(() => {
    if (!rawConfig.value) return [];

    return rawConfig.value.navigation.sidebar
      .map((item) => {
        const meta = menuMap[item.key];
        if (!meta) return null;

        const children = (item.children ?? [])
          .map((childKey) => {
            const childMeta = menuMap[childKey];
            if (!childMeta) return null;

            return {
              key: childKey,
              label: childMeta.label,
              icon: childMeta.icon,
              to: childMeta.to,
            };
          })
          .filter(Boolean) as MenuItem[];

        return {
          key: item.key,
          label: meta.label,
          icon: meta.icon,
          to: meta.to,
          children: children.length ? children : undefined,
        };
      })
      .filter(Boolean) as MenuItem[];
  });

  return {
    fetchMenu,
    sidebarMenu,
  };
};
