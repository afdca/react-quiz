import type { IBundle, IExam } from "@/types/api"
import { type UseSuspenseQueryOptions } from "@tanstack/react-query"
import { getExams } from "../api/get-exams"

export function getExamsQueryOptions<T = IExam[]>(
  params?:
    | {
        select: (exams: IExam[]) => T
      }
    | undefined
): UseSuspenseQueryOptions<IExam[], Error, T> {
  return {
    queryKey: ["exams"],
    queryFn: () => getExams(),
    ...(params ? { select: params.select } : {}),
  }
}

export function selectExam({ examId }: { examId: string }): (exams: IExam[]) => IExam | undefined {
  return (exams: IExam[]) => exams.find((e) => e.id === examId)
}

export function selectBundles({
  examId,
}: {
  examId: string
}): (exams: IExam[]) => IBundle[] | undefined {
  return (exams: IExam[]) => exams.find((e) => e.id === examId)?.bundles
}

export function selectBundle({
  examId,
  bundleId,
}: {
  examId: string
  bundleId: string
}): (exams: IExam[]) => IBundle | undefined {
  return (exams: IExam[]) =>
    exams
      .find((exam: IExam) => exam.id === examId)
      ?.bundles.find((bundle: IBundle) => bundle.id === bundleId)
}
