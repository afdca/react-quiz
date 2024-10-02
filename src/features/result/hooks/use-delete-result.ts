import { deleteResult } from "@/features/result/api/delete-result"
import { useGuestResultsStore } from "@/features/result/hooks/use-results-store"
import { requireAuth } from "@/lib/auth"
import type { IUser } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getResultsQueryOptions } from "./use-results"

export function useDeleteResult() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (variables: { bundleId: string }) => {
      const user: IUser = await requireAuth()
      if (!user.isPro) {
        useGuestResultsStore.getState().removeResult({ bundleId: variables.bundleId })
      } else {
        await deleteResult({ bundleId: variables.bundleId })
      }
      await queryClient.invalidateQueries({
        queryKey: getResultsQueryOptions().queryKey,
      })
    },
  })
}
