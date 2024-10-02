import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { getAnswersQueryOptions } from "@/features/answers/hooks/use-answers"
import { getQuestionsQueryOptions } from "@/features/questions/hooks/use-questions"
import { getResultsQueryOptions, selectResult } from "@/features/result/hooks/use-results"
import { useRouteParams } from "@/hooks/use-route-params"
import { getQueryClient } from "@/lib/query-client"
import type { IAnswer, IQuestion } from "@/types/api"
import {
  faArrowLeft,
  faArrowRight,
  faCheckCircle,
  faFlag,
  faListCheck,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSuspenseQuery } from "@tanstack/react-query"
import cx from "classix"
import { Link, Navigate, type LoaderFunctionArgs } from "react-router-dom"

const letters = ["a", "b", "c", "d", "e", "f", "g", "h"] as const

export function resultQuestionRouteLoader({ params }: LoaderFunctionArgs): true {
  const { bundleId = "" } = params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(getAnswersQueryOptions({ bundleId }))
  void queryClient.prefetchQuery(getQuestionsQueryOptions({ bundleId }))
  void queryClient.prefetchQuery(getResultsQueryOptions())
  return true
}

export function ResultQuestionRoute(): JSX.Element {
  const { bundleId, questionIndex } = useRouteParams()
  const { data: questions } = useSuspenseQuery(getQuestionsQueryOptions({ bundleId }))
  const { data: answers } = useSuspenseQuery(getAnswersQueryOptions({ bundleId }))
  const { data: result } = useSuspenseQuery(
    getResultsQueryOptions({ select: selectResult({ bundleId }) })
  )

  const question: IQuestion | undefined = questions[questionIndex]
  const answer: IAnswer | undefined = answers[questionIndex]
  if (!question || !answer || !result) {
    console.log("Missing data", { bundleId, questionIndex, question, answer, result })
    return <Navigate to={"../summary"} />
  }

  const { choices, multiChoice, questionText } = question
  const { correctChoices, correctChoicesDetail } = answer
  const isFlagged = result.flaggedQuestions.includes(questionIndex)
  const isResultSuccess =
    result.selectedChoicesMatrix[questionIndex]?.length === correctChoices.length &&
    correctChoices.every((choiceIndex) =>
      result.selectedChoicesMatrix[questionIndex]?.includes(choiceIndex)
    )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        {
          <div className="tooltip" data-tip={isFlagged ? "Flagged" : "Not flagged"}>
            <button className={"btn btn-accent"} disabled>
              <FontAwesomeIcon icon={faFlag} className={cx(isFlagged && "text-accent")} />
            </button>
          </div>
        }
        <Link to={"../summary"} className="btn btn-primary">
          <FontAwesomeIcon icon={faListCheck} />
          Summary
        </Link>
      </div>

      <h3 className="font-bold divider">Question {questionIndex + 1}</h3>

      <div className="flex flex-col gap-2">
        <div className="whitespace-pre-line">{questionText}</div>
        <ul>
          {choices.map((choiceText: string, choiceIndex: number) => {
            const isSelectedChoice =
              result.selectedChoicesMatrix[questionIndex]?.includes(choiceIndex) ?? false
            const isCorrectChoice = correctChoices.includes(choiceIndex)
            return (
              /*
              Notes:
              - using the choiceIndex as a key is ok here because the list does not change
                while the user remains on the same question
              - questionIndex must be part of the key, otherwise the key remains the same from one question to the next,
                which prevents the "checked" state of the checkbox/radio from resetting
              */
              <li key={`${String(questionIndex)}-${String(choiceIndex)}`}>
                <div className="form-control">
                  <label
                    className={cx(
                      "justify-start gap-2 opacity-70 label",
                      isCorrectChoice ? "text-primary font-bold" : ""
                    )}
                  >
                    <input
                      type={multiChoice ? "checkbox" : "radio"}
                      className={cx(
                        multiChoice && "checkbox",
                        multiChoice && (isCorrectChoice ? "checkbox-primary" : ""),
                        !multiChoice && "radio",
                        !multiChoice && (isCorrectChoice ? "radio-primary" : "")
                      )}
                      name="answer"
                      value={choiceIndex}
                      checked={isSelectedChoice}
                      readOnly
                    />
                    <span>
                      {letters[choiceIndex]}. {choiceText}
                    </span>
                  </label>
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <h3 className={cx("font-bold divider", isResultSuccess ? "text-success" : "text-error")}>
        <FontAwesomeIcon icon={isResultSuccess ? faCheckCircle : faXmarkCircle} />
        {isResultSuccess ? <>Correct</> : <>Incorrect</>}
      </h3>

      <div className="whitespace-pre-line">{correctChoicesDetail}</div>

      <div className="flex gap-4">
        <Link
          to={`../questions/${String(questionIndex)}`}
          className={cx("btn btn-primary btn-outline", !questionIndex && "btn-disabled")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Previous
        </Link>
        <Link
          to={
            questions.length > questionIndex + 1
              ? `../questions/${String(questionIndex + 2)}`
              : "../summary"
          }
          className="btn btn-primary btn-outline"
        >
          <FontAwesomeIcon icon={faArrowRight} />
          Next
        </Link>
      </div>
      <ScrollToTopButton behavior="smooth" />
    </div>
  )
}
