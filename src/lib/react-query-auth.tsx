import type { IUser } from "@/types/api"
import {
  useMutation,
  useQueryClient,
  type MutationFunction,
  type QueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { useCallback } from "react"
import { getQueryClient } from "./query-client"

interface ReactQueryAuthConfig<LoginCredentials> {
  loginFn: MutationFunction<IUser, LoginCredentials>
  logoutFn: MutationFunction
  refreshTokenFn: MutationFunction<IUser>
  tokenKey?: QueryKey
}

export function configureAuth<Error, LoginCredentials>(
  config: ReactQueryAuthConfig<LoginCredentials>
) {
  const { tokenKey = ["auth-user"], loginFn, logoutFn, refreshTokenFn } = config

  const useLogin = (
    options?: Omit<UseMutationOptions<IUser, Error, LoginCredentials>, "mutationFn">
  ) => {
    const queryClient: QueryClient = useQueryClient()

    const setUser = useCallback(
      (data: IUser) => queryClient.setQueryData(tokenKey, data),
      [queryClient]
    )

    return useMutation({
      ...options,
      mutationKey: ["login"],
      mutationFn: loginFn,
      onSuccess: (user: IUser, ...rest) => {
        setUser(user)
        options?.onSuccess?.(user, ...rest)
      },
    })
  }

  const useLogout = (options?: Omit<UseMutationOptions<unknown, Error, unknown>, "mutationFn">) => {
    const queryClient = useQueryClient()
    const resetToken = useCallback(() => queryClient.setQueryData(tokenKey, null), [queryClient])

    return useMutation({
      ...options,
      mutationFn: logoutFn,
      onSuccess: (...args: [data: unknown, variables: unknown, context: unknown]): void => {
        resetToken()
        options?.onSuccess?.(...args)
      },
    })
  }

  /** Requests an auth token if none is available, and throws if the auth token request fails. */
  const requireAuth = async () => {
    return await getQueryClient().fetchQuery({ queryKey: tokenKey, queryFn: refreshTokenFn })
  }

  return { requireAuth, useLogin, useLogout }
}
