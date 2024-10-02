import { AttemptTimebar } from "@/features/attempt/components/attempt-timebar"
import { useAttempt } from "@/features/attempt/hooks/use-attempt"
import { getExamsQueryOptions } from "@/features/exams/hooks/use-exams"
import { QuestionsNavbar } from "@/features/questions/components/questions-navbar"
import { getQuestionsQueryOptions } from "@/features/questions/hooks/use-questions"
import { getResultsQueryOptions, selectResult } from "@/features/result/hooks/use-results"
import { useRouteParams } from "@/hooks/use-route-params"
import { getQueryClient } from "@/lib/query-client"
import type { IQuestion } from "@/types/api"
import type { ICrumbHandle } from "@/types/crumb-handle"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Navigate, Outlet, type LoaderFunctionArgs } from "react-router-dom"

export function attemptRouteLoader({ params }: LoaderFunctionArgs): true {
  const { bundleId = "" } = params
  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(getExamsQueryOptions())
  void queryClient.prefetchQuery(getQuestionsQueryOptions({ bundleId }))
  void queryClient.prefetchQuery(getResultsQueryOptions())
  return true
}

export const attemptRouteHandle: ICrumbHandle = {
  crumbs: (match) => [{ to: match.pathname, label: "Attempt" }],
}

export function AttemptRoute(): JSX.Element {
  const { bundleId, examId, questionIndex } = useRouteParams()
  const { attempt } = useAttempt({ bundleId, examId })
  const { data: questions } = useSuspenseQuery(getQuestionsQueryOptions({ bundleId }))
  const { data: result } = useSuspenseQuery(
    getResultsQueryOptions({ select: selectResult({ bundleId }) })
  )
  if (result) {
    console.log("Result already exists", { result, bundleId, examId })
    return <Navigate to={`/exams/${examId}`} />
  }

  const questionsStatusList: ("NoAnswer" | "Answer")[] = questions.map(
    (_: IQuestion, index: number) =>
      attempt.selectedChoicesMatrix[index]?.length ? "Answer" : "NoAnswer"
  )

  return (
    <div className="flex flex-col gap-6">
      <AttemptTimebar />
      <QuestionsNavbar
        flaggedQuestions={attempt.flaggedQuestions}
        questionsStatusList={questionsStatusList}
        selectedQuestionIndex={questionIndex}
      />
      <Outlet />
    </div>
  )
}
