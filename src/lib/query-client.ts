import { env } from "@/config/env"
import { isAuthError } from "@/utils/app-error"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: env.TANSTACK_QUERY_STALE_TIME_DEFAULT,
      gcTime: env.TANSTACK_QUERY_GC_TIME_DEFAULT,
      retry: (failureCount: number, error: Error) => {
        // Retry only once
        return !isAuthError(error) && failureCount < 1
      },
    },
    mutations: {
      retry: (failureCount: number, error: Error) => {
        // retry only once
        return !isAuthError(error) && failureCount < 1
      },
    },
  },
})

export function getQueryClient(): QueryClient {
  return queryClient
}
