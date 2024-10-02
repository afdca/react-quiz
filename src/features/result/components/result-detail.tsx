import type { IBundle, IResult } from "@/types/api"
import { DATE_FORMAT_MEDIUM, DATE_FORMAT_SHORT } from "@/utils/date-format"
import {
  faBook,
  faBookOpen,
  faCalendarDays,
  faChartSimple,
  faCrosshairs,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classix"

export function ResultDetail({
  bundle,
  result,
  isAttemptInProgress,
}: {
  bundle: IBundle
  result?: IResult | undefined | null
  isAttemptInProgress: boolean
}): JSX.Element {
  if (!result) {
    return (
      <div className="flex flex-col gap-1">
        <div>
          {!isAttemptInProgress && (
            <span className="text-secondary">
              <FontAwesomeIcon icon={faBook} className="mr-2" />
              Not started
            </span>
          )}
          {isAttemptInProgress && (
            <span className="text-secondary">
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
              In progress
            </span>
          )}
        </div>
        <div className="font-extralight">
          <FontAwesomeIcon icon={faCrosshairs} className="mr-2" />
          <span>Target score: {bundle.minPassingScore}%</span>
        </div>
      </div>
    )
  }
  const success: boolean = result.scorePercent >= bundle.minPassingScore
  const resultDurationMinutes = Math.floor(result.duration / 60_000)
  const resultDurationSeconds = Math.floor((result.duration % 60_000) / 1_000)
  return (
    <div className="flex flex-col gap-1">
      <div className={cx(success ? "text-success" : "text-error")}>
        <FontAwesomeIcon icon={faChartSimple} className="mr-2" />
        <span className="font-bold">Your score: {result.scorePercent}%</span>
      </div>
      <div>
        <FontAwesomeIcon icon={faCrosshairs} className="mr-2" />
        <span className="font-extralight">Target score: {bundle.minPassingScore}%</span>
      </div>

      <div className="font-extralight">
        <FontAwesomeIcon icon={faStopwatch} className="mr-2" />
        {resultDurationMinutes}min{resultDurationSeconds}sec
      </div>
      <div className="font-extralight">
        <FontAwesomeIcon icon={faCalendarDays} className="mr-2" />
        <span className="md:hidden">{DATE_FORMAT_SHORT.format(result.timestamp)}</span>
        <span className="max-md:hidden">{DATE_FORMAT_MEDIUM.format(result.timestamp)}</span>
      </div>
    </div>
  )
}
