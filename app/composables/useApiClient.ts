import type { ApiError } from '~/types/api';
import { paths } from '~/routes';

export function useApiClient() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  const client = useSanctumClient();
  const sanctumUser = useSanctumUser();
  const router = useRouter()

  const user = useState<any | null>('user', () => null);

  const loading = useState<boolean>('api-loading', () => false);

  const request = async <T>(url: string, options: any = {}): Promise<T> => {
    loading.value = true;
    const skipAuthRedirect = Boolean(options.skipAuthRedirect);
    const sessionSnapshot = skipAuthRedirect ? sanctumUser.value : null;
    try {
      const { headers, skipAuthRedirect: _skipAuthRedirect, ...rest } = options;
      return await client<T>(url, {
        baseURL,
        ...rest,
        headers: {
          Accept: 'application/json',
          ...(headers ?? {}),
        },
      });
    } catch (err: any) {
      const status = err?.response?.status ?? err?.statusCode ?? err?.status;
      const data = err?.response?._data ?? err?.data;

      if (status === 401 && skipAuthRedirect) {
        if (sessionSnapshot != null) sanctumUser.value = sessionSnapshot;
      } else if (status === 401 && import.meta.client) {
        user.value = null;
        await router.push(paths.login)
      }

      const error: ApiError = {
        status,
        message: data?.message ?? err?.message,
        errors: data?.errors,
        data: data?.data,
      };

      throw error;
    } finally {
      loading.value = false;
    }
  };

  return { request, loading };
}
