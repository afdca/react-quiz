import { getAnswersQueryOptions } from "@/features/answers/hooks/use-answers"
import { requireAuth } from "@/lib/auth"
import { getQueryClient } from "@/lib/query-client"
import type { IAnswer, IResult } from "@/types/api"
import { createLocalStoragePersister } from "@/utils/zustand-local-storage-persister"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface IGuestResultsStore {
  results: IResult[]
  setResult: (
    partialResult: Pick<
      IResult,
      "selectedChoicesMatrix" | "bundleId" | "duration" | "flaggedQuestions"
    >
  ) => Promise<void>
  removeResult: (params: { bundleId: string }) => void
}

export const useGuestResultsStore = create<IGuestResultsStore>()(
  persist(
    (set) => ({
      results: [],
      setResult: async (
        partialResult: Pick<
          IResult,
          "selectedChoicesMatrix" | "bundleId" | "duration" | "flaggedQuestions"
        >
      ): Promise<void> => {
        const result: IResult = await computeGuestResult(partialResult)
        set((store: IGuestResultsStore) => {
          return {
            ...store,
            results: store.results
              .filter((r) => r.bundleId !== partialResult.bundleId)
              .concat(result),
          }
        })
      },
      removeResult: ({ bundleId }: { bundleId: string }): void => {
        set((store: IGuestResultsStore) => ({
          results: store.results.filter((r) => r.bundleId !== bundleId),
        }))
      },
    }),
    { name: "react-quiz-results-store", storage: createLocalStoragePersister() }
  )
)

async function computeGuestResult(
  partialResult: Pick<
    IResult,
    "selectedChoicesMatrix" | "bundleId" | "duration" | "flaggedQuestions"
  >
): Promise<IResult> {
  const user = await requireAuth()
  const answers: IAnswer[] = await getQueryClient().fetchQuery(
    getAnswersQueryOptions({ bundleId: partialResult.bundleId })
  )
  return {
    ...partialResult,
    scorePercent: computeGuestScore({
      selectedChoicesMatrix: partialResult.selectedChoicesMatrix,
      allCorrectChoices: answers.map((answer) => answer.correctChoices),
    }),
    timestamp: Date.now(),
    userId: user.username,
  }
}

function computeGuestScore({
  allCorrectChoices,
  selectedChoicesMatrix,
}: {
  selectedChoicesMatrix: Record<number, number[]>
  allCorrectChoices: number[][]
}): number {
  const correctSelectedChoicesCount = allCorrectChoices.reduce(
    (acc, next, index) => (arrayEquals(next, selectedChoicesMatrix[index] ?? []) ? acc + 1 : acc),
    0
  )
  const questionsCount = allCorrectChoices.length
  return Math.floor((correctSelectedChoicesCount * 100) / questionsCount)
}

function arrayEquals(arr1: unknown[], arr2: unknown[]): boolean {
  return arr1.length === arr2.length && arr1.every((a1, index) => a1 === arr2[index])
}
