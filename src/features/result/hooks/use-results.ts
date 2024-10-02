import { getResults } from "@/features/result/api/get-results"
import { useGuestResultsStore } from "@/features/result/hooks/use-results-store"
import { requireAuth } from "@/lib/auth"
import type { IResult, IUser } from "@/types/api"
import type { UseSuspenseQueryOptions } from "@tanstack/react-query"

export function getResultsQueryOptions<T = IResult[]>({
  select,
}: {
  select?: ((results: IResult[]) => T) | undefined
} = {}): UseSuspenseQueryOptions<IResult[], Error, T> {
  return {
    queryKey: ["results"],
    queryFn: async () => {
      const user: IUser = await requireAuth()
      // For guest users results are stored in Zustand instead of the remote API
      const results: IResult[] = !user.isPro
        ? useGuestResultsStore.getState().results
        : await getResults()
      return results
    },
    ...(select ? { select } : {}),
  }
}

export function selectResult({
  bundleId,
}: {
  bundleId: string
}): (results: IResult[]) => IResult | undefined {
  return (results: IResult[]) => results.find((r) => r.bundleId === bundleId)
}
