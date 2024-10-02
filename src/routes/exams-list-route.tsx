import { ExamLinksList } from "@/features/exams/components/exams-list-link"
import { getExamsQueryOptions } from "@/features/exams/hooks/use-exams"
import { getQueryClient } from "@/lib/query-client"
import type { IExam } from "@/types/api"
import type { ICrumbHandle } from "@/types/crumb-handle"
import { useSuspenseQuery } from "@tanstack/react-query"

export const examsListRouteHandle: ICrumbHandle = {
  crumbs: () => [{ to: "/exams", label: "Exams" }],
}

export function examsListRouteLoader(): true {
  void getQueryClient().prefetchQuery(getExamsQueryOptions())
  return true
}

export function ExamsListRoute(): JSX.Element {
  const { data: exams } = useSuspenseQuery(getExamsQueryOptions())

  const guestExams: IExam[] = exams.filter((exam) => exam.level === "guest")
  const beginnerExams: IExam[] = exams.filter((exam) => exam.level === "beginner")
  const intermediateExams: IExam[] = exams.filter((exam) => exam.level === "intermediate")
  const advancedExams: IExam[] = exams.filter((exam) => exam.level === "advanced")

  return (
    <>
      <div className="flex flex-col items-center gap-2 min-w-72">
        {!!guestExams.length && (
          <>
            <span className="italic divider">Guest exams</span>
            <ExamLinksList exams={guestExams} />
          </>
        )}
        {!!beginnerExams.length && (
          <>
            <span className="italic divider">Beginner level</span>
            <ExamLinksList exams={beginnerExams} />
          </>
        )}
        {!!intermediateExams.length && (
          <>
            <span className="italic divider">Intermediate level</span>
            <ExamLinksList exams={intermediateExams} />
          </>
        )}
        {!!advancedExams.length && (
          <>
            <span className="italic divider">Advanced level</span>
            <ExamLinksList exams={advancedExams} />
          </>
        )}
      </div>
      <div className="font-extralight text-center">
        (Note: more exams will be added in later releases)
      </div>
    </>
  )
}
