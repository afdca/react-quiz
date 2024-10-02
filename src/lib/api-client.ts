import type { IAuthToken } from "@/types/api"
import ky, { type KyInstance } from "ky"

let bearerToken = ""
let bearerTokenExpirationDate = 0
let authenticationCheckFn: (request: Request) => Promise<void> = () =>
  new Promise((_res, reject) => {
    reject(Error("authenticationCheckFn is not set"))
  })

export function setAccessToken({
  idToken,
  expiresIn,
}: Pick<IAuthToken, "idToken" | "expiresIn">): void {
  bearerToken = `Bearer ${idToken}`
  bearerTokenExpirationDate = Date.now() + expiresIn
}

export function setAuthenticationChecker(authCheckFn: typeof authenticationCheckFn) {
  authenticationCheckFn = authCheckFn
}

async function checkAuthentication(request: Request): Promise<void> {
  await authenticationCheckFn(request)
}

// async function logResponse(
//   request: Request,
//   __: NormalizedOptions,
//   response: Response
// ): Promise<void> {
//   const jsonResponse = (await response.json()) as unknown
//   console.log({
//     jsonResponse,
//     url: response.url,
//     status: response.status,
//     method: request.method,
//     mode: request.mode,
//   })
// }

function isTokenValid(): boolean {
  return !!bearerToken && Date.now() < bearerTokenExpirationDate
}

function addAuthorizationHeader(request: Request): Request {
  if (isTokenValid() && ["PUT", "DELETE", "POST"].includes(request.method.toUpperCase())) {
    // Token only required for data altering methods
    request.headers.set("Authorization", bearerToken)
  }
  return request
}

const apiClient = ky.extend({
  prefixUrl: `${window.location.origin}/api`,
  credentials: "same-origin",
  hooks: {
    beforeRequest: [checkAuthentication, addAuthorizationHeader],
  },
  retry: 0, // Only Tanstack Query should handle retries
})

export function getApiClient(): KyInstance {
  return apiClient
}
