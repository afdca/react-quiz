import { useParams } from "react-router-dom"

/** A simple hook to reduce code repetition and provide auto-completion for param names */
export function useRouteParams(): {
  bundleId: string
  examId: string
  questionIndex: number
} {
  const { bundleId = "", examId = "", questionNumber } = useParams()
  return { bundleId, examId, questionIndex: Number(questionNumber ?? NaN) - 1 }
}
