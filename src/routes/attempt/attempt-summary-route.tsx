import { Dialog } from "@/components/dialog"
import { useAttempt } from "@/features/attempt/hooks/use-attempt"
import { useNotifications } from "@/features/notifications/notifications-store"
import { getQuestionsQueryOptions } from "@/features/questions/hooks/use-questions"
import { usePutResultMutation } from "@/features/result/hooks/use-put-result"
import { useRouteParams } from "@/hooks/use-route-params"
import { getQueryClient } from "@/lib/query-client"
import {
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faFlag,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSuspenseQuery } from "@tanstack/react-query"
import cx from "classix"
import { useRef } from "react"
import { useNavigate, type LoaderFunctionArgs } from "react-router-dom"

export function attemptSummaryRouteLoader({ params }: LoaderFunctionArgs): true {
  const { bundleId = "" } = params
  void getQueryClient().prefetchQuery(getQuestionsQueryOptions({ bundleId }))
  return true
}

export function AttemptSummaryRoute(): JSX.Element {
  const { bundleId, examId } = useRouteParams()
  const { attempt, removeAttempt } = useAttempt({ bundleId, examId })
  const { data: questions } = useSuspenseQuery(getQuestionsQueryOptions({ bundleId }))
  const putResult = usePutResultMutation({ bundleId })
  const { promise: notificationPromise } = useNotifications()
  const navigate = useNavigate()
  const dialogRef = useRef<HTMLDialogElement>(null)

  const answersCount = Object.keys(attempt.selectedChoicesMatrix).length
  const flaggedQuestionsCount = attempt.flaggedQuestions.length
  const missingAnswersCount = questions.length - answersCount

  const onConfirmSubmit = (): void => {
    notificationPromise({
      successMsg: "Result saved",
      successDuration: 4_000,
      pendingMsg: "Saving result, please wait...",
      errorMsg: "An error has occurred, please try again later",
      errorDuration: 4_000,
      promise: putResult
        .mutateAsync({
          partialResult: {
            duration: Math.min(attempt.allottedTime - attempt.remainingTime, attempt.allottedTime),
            flaggedQuestions: attempt.flaggedQuestions,
            selectedChoicesMatrix: attempt.selectedChoicesMatrix,
          },
        })
        .then(() => {
          removeAttempt()
          navigate(`/exams/${examId}`)
        }),
    })
  }

  return (
    <div className="flex flex-col items-center">
      <h3 className="font-bold divider">Summary</h3>
      <div className="flex flex-col gap-2">
        <div>
          <FontAwesomeIcon icon={faCheckCircle} className="mx-2 text-primary" />
          Answers: {answersCount} / {questions.length}
        </div>
        <div>
          <FontAwesomeIcon icon={faFlag} className="mx-2 text-accent" />
          Flags: {flaggedQuestionsCount}
        </div>
        <button
          className={cx("my-2 btn btn-primary", putResult.isPending && "animate-pulse")}
          onClick={() => dialogRef.current?.showModal()}
          disabled={putResult.isPending}
        >
          Submit exam
        </button>
      </div>
      <Dialog
        ref={dialogRef}
        actionButtons={
          <>
            <button className="btn btn-primary" onClick={onConfirmSubmit}>
              Confirm
            </button>
            <button className="btn">Cancel</button>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <h3 className="flex gap-2 items-center text-lg font-bold">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-primary" />
            <span>Submit exam</span>
          </h3>
          {missingAnswersCount > 0 && (
            <div className="flex flex-col italic">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" size="lg" />
              <p>{missingAnswersCount} unanswered questions remaining</p>
            </div>
          )}
          <p className="text-center">Are you sure you want to end the exam?</p>
        </div>
      </Dialog>
    </div>
  )
}
