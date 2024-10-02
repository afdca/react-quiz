import { getApiClient, setAccessToken, setAuthenticationChecker } from "@/lib/api-client"
import { getQueryClient } from "@/lib/query-client"
import type { IAuthToken, ILoginInput, IUser } from "@/types/api"
import { navigateToLoginRoute } from "@/utils/router"
import {
  useMutation,
  type MutationFunction,
  type QueryKey,
  type UseMutationOptions,
  type UseSuspenseQueryOptions,
} from "@tanstack/react-query"

interface ReactQueryAuthConfig<LoginCredentials> {
  loginFn: MutationFunction<IUser, LoginCredentials>
  logoutFn: MutationFunction
  refreshTokenFn: MutationFunction<IUser>
  tokenKey?: QueryKey
}

function configureAuth<Error, LoginCredentials>(config: ReactQueryAuthConfig<LoginCredentials>) {
  const { tokenKey = ["auth-user"], loginFn, logoutFn, refreshTokenFn } = config

  const useLogin = (
    options?: Omit<UseMutationOptions<IUser, Error, LoginCredentials>, "mutationFn">
  ) => {
    return useMutation({
      ...options,
      mutationKey: ["login"],
      mutationFn: loginFn,
      onSuccess: (user: IUser, ...rest) => {
        /* 
        `resetQueries()` is used instead of `invalidateQueries()` because 
        the app should not display stale data (potentially belonging to another user) while refetching
        */
        void getQueryClient().resetQueries()
        getQueryClient().setQueryData(tokenKey, user)
        options?.onSuccess?.(user, ...rest)
      },
    })
  }

  const useLogout = (options?: Omit<UseMutationOptions<unknown, Error, unknown>, "mutationFn">) => {
    return useMutation({
      ...options,
      mutationFn: logoutFn,
      onSuccess: (...args: [data: unknown, variables: unknown, context: unknown]): void => {
        void getQueryClient().resetQueries()
        options?.onSuccess?.(...args)
      },
    })
  }

  const getAuthQueryOptions = (): UseSuspenseQueryOptions<IUser> => ({
    queryKey: tokenKey,
    queryFn: refreshTokenFn,
  })

  /** Requests an auth token + cookie if none is available, and throws if the request fails. */
  const requireAuth = async () => {
    return await getQueryClient().fetchQuery(getAuthQueryOptions())
  }

  setAuthenticationChecker(async (request: Request) => {
    const isAuthRequired = !/\/auth\/((guest-)?(login|refresh))$/.test(request.url)
    if (isAuthRequired) await requireAuth()
  })

  return { getAuthQueryOptions, requireAuth, useLogin, useLogout }
}

const authConfig: ReactQueryAuthConfig<ILoginInput | "guest"> = {
  logoutFn: async (): Promise<void> =>
    getApiClient()
      .post("auth/logout")
      .then(() => void 0),
  loginFn: async (loginInput: ILoginInput | "guest"): Promise<IUser> => {
    const isPro = loginInput !== "guest"
    const responsePromise = !isPro
      ? getApiClient().post("auth/guest-login")
      : getApiClient().post("auth/login", {
          json: { username: loginInput.username, password: loginInput.password },
        })
    const response: IAuthToken = await responsePromise.json()
    const { idToken, expiresIn, username } = response
    setAccessToken({ idToken, expiresIn })
    return { expiresIn, username, isPro }
  },
  refreshTokenFn: async () => {
    const cookies = document.cookie.split(";").map((c) => c.trim())
    const isRefreshTokenValid = cookies.some((c) => c.startsWith("userType="))
    if (!isRefreshTokenValid) {
      console.log("Missing refresh token => go to login route")
      await navigateToLoginRoute()
      throw Error("Missing refresh token")
    }
    const isPro = document.cookie === "refreshTokenUserType=pro"
    const response: IAuthToken = await getApiClient()
      .post(!isPro ? "auth/guest-refresh" : "auth/refresh")
      .json()
    const { idToken, expiresIn, username } = response
    setAccessToken({ idToken, expiresIn })
    return { expiresIn, username, isPro }
  },
}

export const { getAuthQueryOptions, requireAuth, useLogin, useLogout } = configureAuth(authConfig)
