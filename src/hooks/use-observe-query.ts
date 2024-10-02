import { useQuery, type UseSuspenseQueryOptions } from "@tanstack/react-query"

/**
 * Custom  hook to observe query data without triggering requests
 * @see https://github.com/TanStack/query/discussions/846#discussioncomment-6885174
 */
export function useObserveQuery<TData>(options: UseSuspenseQueryOptions<TData>) {
  return useQuery<TData>({ queryKey: options.queryKey, enabled: false })
}
