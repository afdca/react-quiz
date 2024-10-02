import { getQuestions } from "@/features/questions/api/get-questions"
import type { IQuestion } from "@/types/api"
import { type UseSuspenseQueryOptions } from "@tanstack/react-query"

export function getQuestionsQueryOptions({
  bundleId,
}: {
  bundleId: string
}): UseSuspenseQueryOptions<IQuestion[]> {
  return {
    queryKey: ["questions", bundleId],
    queryFn: () => getQuestions({ bundleId }),
  }
}
