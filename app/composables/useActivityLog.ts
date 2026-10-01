const ACTIVITY_LOG_PATH = "/logs/activity";

export function useActivityLog() {
  const client = useSanctumClient();
  const config = useRuntimeConfig();

  function logActivity(event: string, desc?: string) {
    if (!import.meta.client) return;

    void client(ACTIVITY_LOG_PATH, {
      baseURL: config.public.apiBase as string,
      method: "POST",
      body: {
        event,
        desc: desc?.slice(0, 500),
        location: window.location.pathname.slice(0, 255),
      },
      headers: {
        Accept: "application/json",
      },
    }).catch(() => undefined);
  }

  return { logActivity };
}
