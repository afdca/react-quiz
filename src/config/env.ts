interface IEnv {
  TANSTACK_QUERY_STALE_TIME_DEFAULT: number
  TANSTACK_QUERY_GC_TIME_DEFAULT: number
}

function createEnv(): IEnv {
  const env = import.meta.env
  return {
    TANSTACK_QUERY_STALE_TIME_DEFAULT:
      (env["VITE_APP_TANSTACK_QUERY_STALE_TIME_DEFAULT"] as number | undefined) ?? 3_600 * 1_000,
    TANSTACK_QUERY_GC_TIME_DEFAULT:
      (env["VITE_APP_TANSTACK_QUERY_GC_TIME_DEFAULT"] as number | undefined) ?? 3_600 * 1_000,
  }
}

export const env = createEnv()
