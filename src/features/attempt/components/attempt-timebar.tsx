import { Dialog } from "@/components/dialog"
import { useAttempt } from "@/features/attempt/hooks/use-attempt"
import { useRouteParams } from "@/hooks/use-route-params"
import type { IAttempt } from "@/types/attempt"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classix"
import { useCallback, useEffect, useRef } from "react"

function durationToHhMm(durationMs: number): string {
  return new Date(durationMs) // durationMs examples: 5*60_000 (=5min) || 205*60_000 (=2h10min)
    .toISOString() // "1970-01-01T00:05:00.000Z" || "1970-01-01T02:05:00.000Z"
    .replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") // 00:05:00 || 02:05:00
    .slice(0, -3) // 00:05 || 02:05
    .replace("00:", "") // 05 || 02:05
    .replace(/^0/, "") // 5 || 2:05
    .replace(":", "h") // 5 || 2h05
    .concat("min") // 5min || 2h05min
}

const TIMEBAR_UPDATE_STEP = 1_000 // 1sec

export function AttemptTimebar(): JSX.Element {
  const { bundleId, examId } = useRouteParams()
  const { attempt, setAttempt } = useAttempt({ bundleId, examId })
  const getAttempt = useCallback(() => attempt, [attempt])
  const { allottedTime, remainingTime } = attempt
  const isEndingSoon = remainingTime < Math.floor(attempt.allottedTime * 0.2)

  const timeoutDialogRef = useRef<HTMLDialogElement>(null)
  const timeoutDialogShown = useRef(false)

  useEffect(
    function updateRemainingTime(): VoidFunction {
      const interval = setInterval(() => {
        const attempt: IAttempt = getAttempt()
        const updatedRemainingTime: number = Math.max(
          0,
          attempt.remainingTime - TIMEBAR_UPDATE_STEP
        )
        setAttempt({
          ...attempt,
          remainingTime: updatedRemainingTime,
        })
        if (updatedRemainingTime === 0) {
          clearInterval(interval)
          if (!timeoutDialogShown.current && timeoutDialogRef.current) {
            timeoutDialogRef.current.showModal()
            // eslint-disable-next-line immutable/no-mutation
            timeoutDialogShown.current = true
          }
        }
      }, TIMEBAR_UPDATE_STEP)
      return () => {
        clearInterval(interval)
      }
    },
    [getAttempt, setAttempt]
  )

  return (
    <>
      <div
        className={cx(
          "flex flex-col items-center gap-2",
          attempt.remainingTime > 0 && isEndingSoon && "text-warning font-bold",
          attempt.remainingTime <= 0 && "text-error font-bold"
        )}
      >
        <p>
          <FontAwesomeIcon icon={faClock} className="mx-2" />
          {durationToHhMm(remainingTime + 59_000 /* Round up the displayed time to +1min */)}{" "}
          remaining
        </p>
        <progress
          className={cx(
            "progress",
            isEndingSoon ? "progress-warning" : "progress-primary",
            // TODO fix Firefox animations
            `[&::-webkit-progress-value]:transition-all
          [&::-moz-progress-bar]:transition-all 
          [&::-ms-fill]:transition-all
          [&::-webkit-progress-value]:duration-1000
          [&::-moz-progress-bar]:duration-1000 
          [&::-ms-fill]:duration-1000
          [&::-webkit-progress-value]:ease-linear
          [&::-moz-progress-bar]:ease-linear 
          [&::-ms-fill]:ease-linear
          `
          )}
          value={remainingTime}
          max={allottedTime}
        ></progress>
      </div>
      <Dialog
        ref={timeoutDialogRef}
        // TODO link to summary page
        actionButtons={<button className="btn btn-primary">Close</button>}
      >
        <>
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <FontAwesomeIcon icon={faClock} />
            <span>Time&apos;s up!</span>
          </h3>
          <p className="text-center">You can no longer edit your answers.</p>
          <p className="text-center">
            Please head over to the summary page in order to submit your exam and get your final
            score.
          </p>
        </>
      </Dialog>
    </>
  )
}
