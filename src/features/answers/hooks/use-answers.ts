import type { IAnswer } from "@/types/api"
import { type UseSuspenseQueryOptions } from "@tanstack/react-query"
import { getAnswers } from "../api/get-answers"

export function getAnswersQueryOptions({
  bundleId,
}: {
  bundleId: string
}): UseSuspenseQueryOptions<IAnswer[]> {
  return {
    queryKey: ["answers", bundleId],
    queryFn: () => getAnswers({ bundleId }),
  }
}
