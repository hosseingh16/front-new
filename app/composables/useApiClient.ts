import type { ApiError } from '~/types/api';
import { paths } from '~/routes';

export function useApiClient() {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase;

  const client = useSanctumClient();
  const router = useRouter()

  const user = useState<any | null>('user', () => null);

  const loading = useState<boolean>('api-loading', () => false);

  const request = async <T>(url: string, options: any = {}): Promise<T> => {
    loading.value = true;    
    try {
      const { headers, ...rest } = options;
      return await client<T>(url, {
        baseURL,
        ...rest,
        headers: {
          Accept: 'application/json',
          ...(headers ?? {}),
        },
      });
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?._data;

      if (status === 401) {
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
