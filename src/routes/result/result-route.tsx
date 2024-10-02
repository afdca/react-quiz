import { getAnswersQueryOptions } from "@/features/answers/hooks/use-answers"
import { QuestionsNavbar } from "@/features/questions/components/questions-navbar"
import { getResultsQueryOptions, selectResult } from "@/features/result/hooks/use-results"
import { useRouteParams } from "@/hooks/use-route-params"
import { getQueryClient } from "@/lib/query-client"
import type { IAnswer } from "@/types/api"
import type { ICrumbHandle } from "@/types/crumb-handle"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Navigate, Outlet, type LoaderFunctionArgs } from "react-router-dom"

export const resultRouteHandle: ICrumbHandle = {
  crumbs: (match) => [{ to: match.pathname, label: "Review" }],
}

export function resultRouteLoader({ params }: LoaderFunctionArgs): true {
  const { bundleId = "" } = params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(getResultsQueryOptions())
  void queryClient.prefetchQuery(getAnswersQueryOptions({ bundleId }))
  return true
}

export function ResultRoute(): JSX.Element {
  const { bundleId, examId, questionIndex } = useRouteParams()
  const { data: result } = useSuspenseQuery(
    getResultsQueryOptions({ select: selectResult({ bundleId }) })
  )
  const { data: answers } = useSuspenseQuery(getAnswersQueryOptions({ bundleId }))

  if (!result) {
    console.log("Missing result", { bundleId, result })
    return <Navigate to={`/exams/${examId}`} />
  }

  // TODO memoize if performance issues
  const questionsStatusList: ("Success" | "Fail")[] = answers
    .map(
      (answer: IAnswer, index: number) =>
        result.selectedChoicesMatrix[index]?.length === answer.correctChoices.length &&
        answer.correctChoices.every((choiceIndex) =>
          result.selectedChoicesMatrix[index]?.includes(choiceIndex)
        )
    )
    .map((isSuccess: boolean) => (isSuccess ? "Success" : "Fail"))

  return (
    <div className="flex flex-col gap-6 pt-4">
      <QuestionsNavbar
        flaggedQuestions={result.flaggedQuestions}
        questionsStatusList={questionsStatusList}
        selectedQuestionIndex={questionIndex}
      />
      <Outlet />
    </div>
  )
}
