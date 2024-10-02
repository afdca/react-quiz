import { getUserType, unauthorized } from "@/testing/mocks/handlers/utils"
import { networkDelay } from "@/utils/network-delay"
import { http, HttpHandler, HttpResponse } from "msw"

const GUEST_EXAMS = {
  isFreeAccess: { N: "1" },
  bundles: {
    L: [
      {
        M: {
          allottedTime: { N: "300000" },
          id: { S: "guest_exam_cities" },
          title: { S: "Cities" },
          minPassingScore: { N: "70" },
        },
      },
      {
        M: {
          allottedTime: { N: "300000" },
          id: { S: "guest_exam_animals" },
          title: { S: "Animals" },
          minPassingScore: { N: "70" },
        },
      },
    ],
  },
  id: { S: "guest_exam" },
  level: { S: "guest" },
  title: { S: "General trivia" },
}

// TODO
const PRO_EXAMS = undefined

export function getExamsHandler(): HttpHandler {
  return http.get("/api/cache/exams", async ({ cookies }) => {
    await networkDelay(100)
    const userType: "guest" | "pro" | undefined = getUserType(cookies)
    if (!userType) return unauthorized()

    return HttpResponse.json({
      Items: [userType === "pro" ? PRO_EXAMS : GUEST_EXAMS].filter((e) => !!e),
    })
  })
}
