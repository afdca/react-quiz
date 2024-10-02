import { HTTPError } from "ky"

interface AppErrorDetail {
  cause?: unknown
  context?: object | undefined
  status?: number | undefined
  statusText?: string | undefined
}

export class AppError extends Error {
  // Private constructor to enforce usage of the static factory method "of"
  // which decouples the error constructor from the code that uses the error
  private constructor(public detail: AppErrorDetail) {
    super(detail.statusText ?? "Something went wrong")
    // eslint-disable-next-line immutable/no-mutation, immutable/no-this
    this.cause = detail.cause
  }

  static of(detail: AppErrorDetail): AppError {
    return new AppError(detail)
  }

  static isInstance(error: unknown): error is AppError {
    return error instanceof AppError
  }
}

export function isAuthError(error: unknown): boolean {
  return (
    (error instanceof HTTPError && error.response.status === 401) ||
    (AppError.isInstance(error) && error.detail.status === 401)
  )
}
