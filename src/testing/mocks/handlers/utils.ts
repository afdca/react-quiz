import { HttpResponse, type JsonBodyType, type StrictResponse } from "msw"

export function getUserType(cookies: Record<string, string>): "pro" | "guest" | undefined {
  return cookies["userType"] as "pro" | "guest" | undefined
}

export function unauthorized(): StrictResponse<JsonBodyType> {
  return HttpResponse.json(undefined, { status: 401, statusText: "Unauthorized" })
}
