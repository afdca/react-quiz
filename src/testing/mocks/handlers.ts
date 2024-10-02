import { getAnswersHandler } from "@/testing/mocks/handlers/answers"
import { getAuthHandlers } from "@/testing/mocks/handlers/auth"
import { getExamsHandler } from "@/testing/mocks/handlers/exams"
import { getQuestionsHandler } from "@/testing/mocks/handlers/questions"

export function getHandlers() {
  return [
    // Auth handlers
    ...getAuthHandlers(),

    // Data handlers
    getExamsHandler(),
    getQuestionsHandler(),
    getAnswersHandler(),
    // TODO results handler
  ]
}
