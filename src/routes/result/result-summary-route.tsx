import { getExamsQueryOptions, selectBundle } from "@/features/exams/hooks/use-exams"
import { getResultsQueryOptions, selectResult } from "@/features/result/hooks/use-results"
import { useRouteParams } from "@/hooks/use-route-params"
import { getQueryClient } from "@/lib/query-client"
import { DATE_FORMAT_MEDIUM } from "@/utils/date-format"
import {
  faArrowLeft,
  faCalendarDays,
  faChartSimple,
  faCheck,
  faClock,
  faFlag,
  faListCheck,
  faStopwatch,
  faX,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSuspenseQuery } from "@tanstack/react-query"
import cx from "classix"
import { Link, Navigate } from "react-router-dom"

export function resultSummaryRouteLoader(): true {
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(getExamsQueryOptions())
  void queryClient.prefetchQuery(getResultsQueryOptions())
  return true
}

export function ResultSummaryRoute(): JSX.Element {
  const { bundleId, examId } = useRouteParams()
  const { data: result } = useSuspenseQuery(
    getResultsQueryOptions({ select: selectResult({ bundleId }) })
  )
  const { data: bundle } = useSuspenseQuery(
    getExamsQueryOptions({ select: selectBundle({ examId, bundleId }) })
  )
  if (!result || !bundle) {
    console.log("Missing data", { bundleId, examId, bundle, result })
    return <Navigate to={`/exams/${examId}`} />
  }

  const { duration, flaggedQuestions, scorePercent, timestamp } = result
  const success: boolean = result.scorePercent >= bundle.minPassingScore
  const resultDurationMinutes = Math.floor(duration / 60_000)
  const resultDurationSeconds = Math.floor((duration % 60_000) / 1_000)
  const allottedTimeInMinutes = Math.round(bundle.allottedTime / 60_000)

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="font-bold divider">Summary</h3>
      <div className="shadow stats max-lg:stats-vertical">
        <div className="stat">
          <FontAwesomeIcon icon={faChartSimple} size="xl" className="stat-figure text-secondary" />
          <div className="stat-title">Your score</div>
          <div className="text-sm md:text-lg stat-value">{scorePercent}%</div>
          <div className={cx("font-bold", "stat-desc", success ? "text-success" : "text-error")}>
            <FontAwesomeIcon icon={success ? faCheck : faX} className="mr-1" />
            {success ? "Passed" : "Failed"} (target: {bundle.minPassingScore}%)
          </div>
        </div>
        <div className="stat">
          <FontAwesomeIcon icon={faCalendarDays} size="xl" className="stat-figure text-secondary" />
          <div className="stat-title">Date</div>
          <div className="text-sm md:text-lg stat-value">
            {DATE_FORMAT_MEDIUM.format(timestamp)}
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <FontAwesomeIcon icon={faClock} size="xl" />
          </div>
          <div className="stat-title">Available time</div>
          <div className="text-sm md:text-lg stat-value">{allottedTimeInMinutes} minutes</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <FontAwesomeIcon icon={faStopwatch} size="xl" />
          </div>
          <div className="stat-title">Time used</div>
          <div className="text-sm md:text-lg stat-value">
            {resultDurationMinutes}min{resultDurationSeconds}sec
          </div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <FontAwesomeIcon icon={faFlag} size="xl" />
          </div>
          <div className="stat-title">Flagged questions</div>
          <div className="text-sm md:text-lg stat-value">{flaggedQuestions.length}</div>
        </div>
      </div>
      <Link to="../questions/1" className="btn btn-primary">
        <FontAwesomeIcon icon={faListCheck} />
        Review answers
      </Link>
      <Link to={`/exams/${examId}`} className="btn">
        <FontAwesomeIcon icon={faArrowLeft} />
        Go back
      </Link>
    </div>
  )
}
