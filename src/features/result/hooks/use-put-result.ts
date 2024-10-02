import { putResult } from "@/features/result/api/put-result"
import { getResultsQueryOptions } from "@/features/result/hooks/use-results"
import { useGuestResultsStore } from "@/features/result/hooks/use-results-store"
import { requireAuth } from "@/lib/auth"
import type { IResult, IUser } from "@/types/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function getPutResultMutationQueryKey({ bundleId }: { bundleId: string }): string[] {
  return ["put-result", bundleId]
}

export function usePutResultMutation({ bundleId }: { bundleId: string }) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: getPutResultMutationQueryKey({ bundleId }),
    mutationFn: async (variables: {
      partialResult: Pick<IResult, "selectedChoicesMatrix" | "duration" | "flaggedQuestions">
    }) => {
      const user: IUser = await requireAuth()
      if (!user.isPro) {
        await useGuestResultsStore.getState().setResult({ ...variables.partialResult, bundleId })
      } else {
        await putResult({ ...variables.partialResult, bundleId })
      }
      void queryClient.invalidateQueries({
        queryKey: getResultsQueryOptions().queryKey,
      })
    },
  })
}
