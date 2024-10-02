import { useAttemptsStore } from "@/features/attempt/hooks/use-attempt"
import { getExamsQueryOptions, selectBundles } from "@/features/exams/hooks/use-exams"
import { useNotifications } from "@/features/notifications/notifications-store"
import { DeleteResultButton } from "@/features/result/components/delete-result-button"
import { ResultDetail } from "@/features/result/components/result-detail"
import { useDeleteResult } from "@/features/result/hooks/use-delete-result"
import { getResultsQueryOptions } from "@/features/result/hooks/use-results"
import { useRouteParams } from "@/hooks/use-route-params"
import { getQueryClient } from "@/lib/query-client"
import type { IBundle, IResult } from "@/types/api"
import { assertTruthy } from "@/utils/assert-truthy"
import {
  faListCheck,
  faPauseCircle,
  faPlay,
  faSearchMinus,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSuspenseQuery } from "@tanstack/react-query"
import cx from "classix"
import { Link } from "react-router-dom"

export function bundlesListRouteLoader(): true {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(getExamsQueryOptions())
  void queryClient.prefetchQuery(getResultsQueryOptions())
  return true
}

export function BundlesListRoute(): JSX.Element {
  const { examId } = useRouteParams()
  const notifications = useNotifications()
  const deleteResult = useDeleteResult()
  const attemptsStore = useAttemptsStore()

  const bundlesQuery = useSuspenseQuery(getExamsQueryOptions({ select: selectBundles({ examId }) }))
  const resultsQuery = useSuspenseQuery(getResultsQueryOptions())
  assertTruthy(bundlesQuery.data, { bundlesQuery, examId })
  assertTruthy(resultsQuery.data, { resultsQuery, examId })
  const bundles: IBundle[] = bundlesQuery.data.map((b) => ({
    ...b,
    result: resultsQuery.data.find((r) => r.bundleId === b.id),
  }))
  const isPending = deleteResult.isPending || bundlesQuery.isFetching || resultsQuery.isFetching
  if (!bundles.length) {
    return (
      <div className="flex items-center gap-2">
        <FontAwesomeIcon icon={faSearchMinus} />
        No bundles found
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <table className="table max-w-3xl max-sm:table-xs max-md:table-md md:table-lg">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bundles.map((b: IBundle) => {
            // TODO handle empty lists
            const result: IResult | undefined = b.result
            const isAttemptInProgress: boolean = attemptsStore.isAttemptInProgress({
              bundleId: b.id,
            })
            return (
              <tr key={b.id}>
                <td className="font-bold flex gap-2 items-center justify-center">{b.title}</td>
                <td>
                  <ResultDetail
                    bundle={b}
                    result={result}
                    isAttemptInProgress={isAttemptInProgress}
                  />
                </td>
                <td>
                  <div className="flex sm:flex-row max-sm:flex-col items-start gap-2">
                    {!result && (
                      <Link
                        to={`bundles/${b.id}/attempt/questions/1`}
                        className={cx(
                          "btn btn-primary btn-outline max-sm:btn-xs sm:btn-md",
                          isPending && "btn-disabled animate-pulse"
                        )}
                      >
                        <FontAwesomeIcon icon={isAttemptInProgress ? faPauseCircle : faPlay} />
                        {!isAttemptInProgress && <>Start</>}
                        {isAttemptInProgress && <>Resume</>}
                      </Link>
                    )}
                    {!!result && (
                      <>
                        <Link
                          to={`bundles/${b.id}/result/summary`}
                          className={cx(
                            "btn btn-xs sm:btn-md btn-primary",
                            isPending && "btn-disabled animate-pulse"
                          )}
                        >
                          <FontAwesomeIcon icon={faListCheck} />
                          Review
                        </Link>
                        <DeleteResultButton
                          onDelete={() => {
                            notifications.promise({
                              promise: deleteResult.mutateAsync({ bundleId: b.id }),
                              pendingMsg: "Deleting result, please wait...",
                              successMsg: "Result deleted",
                              successDuration: 4_000,
                              errorMsg: "An error has occurred, please try again later",
                              errorDuration: 4_000,
                            })
                          }}
                          disabled={isPending}
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="font-extralight text-center max-sm:text-sm">
        (Note: more topics will be added in later releases)
      </div>
    </div>
  )
}
