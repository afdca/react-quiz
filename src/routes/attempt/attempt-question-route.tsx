import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { useAttempt } from "@/features/attempt/hooks/use-attempt"
import { getQuestionsQueryOptions } from "@/features/questions/hooks/use-questions"
import { useRouteParams } from "@/hooks/use-route-params"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { getQueryClient } from "@/lib/query-client"
import type { IQuestion } from "@/types/api"
import {
  faArrowLeft,
  faArrowRight,
  faFlag,
  faListCheck,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useIsMutating, useSuspenseQuery } from "@tanstack/react-query"
import cx from "classix"
import { type ChangeEvent } from "react"
import { Link, Navigate, type LoaderFunctionArgs } from "react-router-dom"

const letters = ["a", "b", "c", "d", "e", "f", "g", "h"] as const

export function attemptQuestionRouteLoader({ params }: LoaderFunctionArgs): true {
  const { bundleId = "" } = params
  void getQueryClient().prefetchQuery(getQuestionsQueryOptions({ bundleId }))
  return true
}

export function AttemptQuestionRoute(): JSX.Element {
  const { bundleId, examId, questionIndex } = useRouteParams()
  const { attempt, setAttempt } = useAttempt({ bundleId, examId })
  const { data: questions } = useSuspenseQuery(getQuestionsQueryOptions({ bundleId }))
  const mutationsCount: number = useIsMutating()
  useScrollToTop({ autoScrollOnLocationChange: true, behavior: "smooth" })

  const question: IQuestion | undefined = questions[questionIndex]
  if (!question) {
    console.log("Question not found", { bundleId, examId, questionIndex, questions })
    return <Navigate to={"../summary"} />
  }

  const { choices, multiChoice, questionText } = question
  const isFlagged = attempt.flaggedQuestions.includes(questionIndex)

  const onToggleFlag = function onToggleFlag(): void {
    const flaggedQuestions: number[] = attempt.flaggedQuestions
    setAttempt({
      ...attempt,
      flaggedQuestions: flaggedQuestions.includes(questionIndex)
        ? flaggedQuestions.filter((id) => id !== questionIndex)
        : flaggedQuestions.concat(questionIndex),
    })
  }

  const onChoiceChange = function onChoiceChange(e: ChangeEvent<HTMLInputElement>): void {
    const previousSelectedChoices: number[] = attempt.selectedChoicesMatrix[questionIndex] ?? []
    const choiceIndex = Number(e.target.value)
    const selectedChoicesMatrix: Record<number, number[]> = {
      ...attempt.selectedChoicesMatrix,
      [questionIndex]: !multiChoice
        ? [choiceIndex]
        : e.target.checked
        ? previousSelectedChoices.concat(choiceIndex).toSorted()
        : previousSelectedChoices.filter((i) => i !== choiceIndex),
    }
    setAttempt({ ...attempt, selectedChoicesMatrix })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-2">
        <div className="flex justify-start gap-2">
          <button
            className="btn btn-accent"
            onClick={onToggleFlag}
            disabled={!!mutationsCount || !attempt.remainingTime}
          >
            <FontAwesomeIcon icon={faFlag} />
            {!isFlagged ? "Flag for review" : "Remove flag"}
          </button>
          <span
            className="tooltip"
            data-tip="Flag difficult questions which you want to review later"
          >
            <FontAwesomeIcon icon={faQuestionCircle} className="opacity-85" />
          </span>
        </div>
        <Link to={"../summary"} className="btn btn-primary">
          <FontAwesomeIcon icon={faListCheck} />
          Summary
        </Link>
      </div>

      <h3 className="font-bold divider">Question {questionIndex + 1}</h3>

      <div className="flex flex-col gap-2">
        <div className="whitespace-pre-line">{questionText}</div>
        <ul>
          {choices.map((choiceText: string, choiceIndex: number) => (
            /*
            Notes:
            - using the choiceIndex as a key is ok here because the list does not change
              while the user remains on the same question
            - questionIndex must be part of the key, otherwise the key remains the same when navigating from one question to the next,
              which prevents the "checked" state of the checkbox/radio from resetting
            */
            <li key={`${String(questionIndex)}-${String(choiceIndex)}`}>
              <div className="form-control">
                <label
                  className={cx(
                    "label cursor-pointer justify-start gap-2"
                    // isReviewMode && "opacity-50",
                  )}
                >
                  <input
                    type={multiChoice ? "checkbox" : "radio"}
                    className={multiChoice ? "checkbox" : "radio"}
                    name="answer"
                    value={choiceIndex}
                    defaultChecked={attempt.selectedChoicesMatrix[questionIndex]?.includes(
                      choiceIndex
                    )}
                    onChange={onChoiceChange}
                    disabled={!!mutationsCount || !attempt.remainingTime}
                  />
                  <span>
                    {letters[choiceIndex]}. {choiceText}
                  </span>
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
