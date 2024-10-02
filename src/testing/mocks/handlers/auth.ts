import { getUserType, unauthorized } from "@/testing/mocks/handlers/utils"
import { networkDelay } from "@/utils/network-delay"
import {
  http,
  HttpHandler,
  HttpResponse,
  type DefaultBodyType,
  type JsonBodyType,
  type StrictRequest,
  type StrictResponse,
} from "msw"

interface ResolverParams {
  request: StrictRequest<DefaultBodyType>
  cookies: Record<string, string>
}

const ONE_HOUR = 3600 * 1000
const FORBIDDEN_COOKIE_ATTRIBUTES = [
  /**
   * This is a workaround: HttpOnly cookies aren't supported by MSW for some reason so they can't be used in the mock responses below.
   * When the issue gets fixed HttpOnly can be re-enabled by removing the code that uses this variable.
   */
  "HttpOnly",
  // Disable Secure cookies in order to avoid https for localhost testing
  "Secure",
] as const

function checkAuthCookie(cookies: Record<string, string>): boolean {
  // In prod Cloudfront checks the "CloudFront-" prefixed cookies instead
  // but for mocking purposes the process can be simplified
  return !!getUserType(cookies)
}

async function loginAndRefreshResolver({
  cookies,
  request,
}: ResolverParams): Promise<StrictResponse<JsonBodyType>> {
  await networkDelay(1000)
  const userType: "Guest" | "Pro" = request.url.includes("guest") ? "Guest" : "Pro"
  const isRefreshTokenRequest: boolean = request.url.includes("refresh")

  if (isRefreshTokenRequest && !checkAuthCookie(cookies)) return unauthorized()

  const authMaxAge = String(ONE_HOUR)
  const refreshMaxAge = String(ONE_HOUR * 24)

  const headers: [string, string][] = [
    `CloudFront-Key-Pair-Id=cfKeyPairId${userType}; Max-Age=${authMaxAge}; Path=/api`,
    `CloudFront-Policy=cfPolicy${userType}; Max-Age=${authMaxAge}; Path=/api`,
    `CloudFront-Signature=cfSignature${userType}; Max-Age=${authMaxAge}; Path=/api`,
    `userType=${userType.toLowerCase()}; Max-Age=${refreshMaxAge}; Path=/`,
    userType === "Pro"
      ? `refreshToken=refreshTokenPro; Max-Age=${refreshMaxAge}; Path=/api/auth/refresh`
      : `refreshToken=; Max-Age=0; Path=/api/auth/refresh`,
  ]
    // Only update the refresh token when the user logs in
    .filter((c) => !isRefreshTokenRequest || !c.startsWith("refresh"))
    .map((c) => `${c}; SameSite=Strict`)
    .map((c) => (!FORBIDDEN_COOKIE_ATTRIBUTES.includes("Secure") ? `${c}; Secure` : c))
    .map((c) =>
      !c.startsWith("userType") && !FORBIDDEN_COOKIE_ATTRIBUTES.includes("HttpOnly")
        ? `${c}; HttpOnly`
        : c
    )
    .map((c) => ["Set-Cookie", c])

  return HttpResponse.json(
    {
      idToken: userType === "Pro" ? "idTokenPro" : undefined,
      expiresIn: ONE_HOUR,
      username: userType.toLowerCase(),
    },
    { headers }
  )
}

export function getAuthHandlers(): HttpHandler[] {
  const login = http.post("/api/auth/login", async (params) => {
    const { username, password } = (await params.request.json()) as Partial<{
      username: string
      password: string
    }>
    return username === "pro" && password === "pro"
      ? loginAndRefreshResolver(params)
      : unauthorized()
  })

  const refresh = http.post("/api/auth/refresh", loginAndRefreshResolver)
  const guestLogin = http.post("/api/auth/guest-login", loginAndRefreshResolver)
  const guestRefresh = http.post("/api/auth/guest-refresh", loginAndRefreshResolver)
  const logout = http.post("/api/auth/logout", async () => {
    await networkDelay(1_000)

    const headers: [string, string][] = [
      "CloudFront-Key-Pair-Id=; Path=/api",
      "CloudFront-Policy=; Path=/api",
      "CloudFront-Signature=; Path=/api",
      "refreshToken=; Path=/api/auth/refresh",
      "userType=; Path=/",
    ]
      .map((c) => `${c}; SameSite=Strict; Max-Age=0`)
      .map((c) => (!FORBIDDEN_COOKIE_ATTRIBUTES.includes("Secure") ? `${c}; Secure` : c))
      .map((c) =>
        !c.startsWith("userType") && !FORBIDDEN_COOKIE_ATTRIBUTES.includes("HttpOnly")
          ? `${c}; HttpOnly`
          : c
      )
      .map((c) => ["Set-Cookie", c])
    return HttpResponse.json({}, { headers })
  })
  return [login, refresh, guestLogin, guestRefresh, logout]
}
