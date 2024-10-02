import { getApiClient } from "@/lib/api-client"
import type { IResult } from "@/types/api"

export async function putResult(
  partialResult: Pick<
    IResult,
    "selectedChoicesMatrix" | "bundleId" | "duration" | "flaggedQuestions"
  >
) {
  const { selectedChoicesMatrix, bundleId, duration, flaggedQuestions } = partialResult
  await getApiClient().put(`results/${bundleId}`, {
    json: { selectedChoicesMatrix, duration, flaggedQuestions },
  })
}
