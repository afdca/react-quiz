import { getExamsQueryOptions } from "@/features/exams/hooks/use-exams"
import { useRouteParams } from "@/hooks/use-route-params"
import { getQueryClient } from "@/lib/query-client"
import type { IExam } from "@/types/api"
import type { ICrumbHandle } from "@/types/crumb-handle"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"

export function examRouteLoader(): true {
  void getQueryClient().prefetchQuery(getExamsQueryOptions())
  return true
}

function ExamCrumb(): JSX.Element {
  const { examId } = useRouteParams()
  const { data: crumbLabel } = useSuspenseQuery(
    getExamsQueryOptions({
      select: (exams: IExam[]) => exams.find((e) => e.id === examId)?.title ?? "",
    })
  )
  return <>{crumbLabel}</>
}

export const examRouteHandle: ICrumbHandle = {
  crumbs: (match) => {
    return [
      { to: "/exams", label: "Exams" },
      { to: match.pathname, label: <ExamCrumb /> },
    ]
  },
}

export function ExamRoute(): JSX.Element {
  return <Outlet />
}
