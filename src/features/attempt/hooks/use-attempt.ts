import { getExamsQueryOptions, selectBundle } from "@/features/exams/hooks/use-exams"
import type { IAttempt } from "@/types/attempt"
import { assertTruthy } from "@/utils/assert-truthy"
import { createLocalStoragePersister } from "@/utils/zustand-local-storage-persister"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useCallback } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface IAttemptsStore {
  attempts: Record<string, IAttempt | undefined>
  setAttempt: (params: { attempt: IAttempt; bundleId: string }) => void
  removeAttempt: (params: { bundleId: string }) => void
  isAttemptInProgress: (params: { bundleId: string }) => boolean
  resetAttempts: () => void
}

function createAttempt({ allottedTime }: { allottedTime: number }): IAttempt {
  return {
    selectedChoicesMatrix: {},
    flaggedQuestions: [],
    startTime: Date.now(),
    allottedTime,
    remainingTime: allottedTime,
  }
}

export const useAttemptsStore = create<IAttemptsStore>()(
  persist(
    (set, get) => ({
      attempts: {},
      setAttempt: ({ bundleId, attempt }: { bundleId: string; attempt: IAttempt }): void => {
        set((store: IAttemptsStore) => ({
          attempts: {
            ...store.attempts,
            [bundleId]: attempt,
          },
        }))
      },
      removeAttempt: ({ bundleId }: { bundleId: string }): void => {
        set((store: IAttemptsStore) => ({
          attempts: {
            ...store.attempts,
            [bundleId]: undefined,
          },
        }))
      },
      isAttemptInProgress: ({ bundleId }: { bundleId: string }): boolean => {
        const attempt: IAttempt | undefined = get().attempts[bundleId]
        return (
          !!attempt &&
          (attempt.allottedTime !== attempt.remainingTime ||
            !!attempt.flaggedQuestions.length ||
            !!Object.keys(attempt.selectedChoicesMatrix).length)
        )
      },
      resetAttempts: (): void => {
        set((store) => ({
          ...store,
          attempts: {},
        }))
      },
    }),
    { name: "react-quiz-attempts-store", storage: createLocalStoragePersister() }
  )
)

export function useAttempt({ bundleId, examId }: { bundleId: string; examId: string }): {
  attempt: IAttempt
  setAttempt: (attempt: IAttempt) => void
  removeAttempt: () => void
} {
  const attemptsStore: IAttemptsStore = useAttemptsStore()
  const { data: bundle } = useSuspenseQuery(
    getExamsQueryOptions({ select: selectBundle({ examId, bundleId }) })
  )
  assertTruthy(bundle, { bundle, bundleId })

  const attempt: IAttempt =
    attemptsStore.attempts[bundleId] ?? createAttempt({ allottedTime: bundle.allottedTime })

  const setAttempt = useCallback(
    (attempt: IAttempt): void => {
      attemptsStore.setAttempt({ bundleId, attempt })
    },
    [attemptsStore, bundleId]
  )

  const removeAttempt = useCallback((): void => {
    attemptsStore.removeAttempt({ bundleId })
  }, [attemptsStore, bundleId])

  return { attempt, removeAttempt, setAttempt }
}
