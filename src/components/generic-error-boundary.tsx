import { AppError, isAuthError } from "@/utils/app-error"
import { stringify } from "@/utils/stringify"
import { faArrowLeft, faArrowsRotate, faWarning } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Navigate, useLocation, useRouteError } from "react-router-dom"

export function GenericErrorBoundary(): JSX.Element {
  const location = useLocation()
  const error: unknown = useRouteError()
  const isAppError = AppError.isInstance(error)

  if (isAuthError(error)) {
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(location.pathname)}`} />
  }

  console.error(AppError.isInstance(error) ? stringify(error) : error)

  const message = isAppError ? error.detail.statusText : "Something went wrong"
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <FontAwesomeIcon icon={faWarning} size="8x" className="text-warning" />
      <div className="text-xl font-bold">{message}</div>
      <button
        className="mt-6 btn btn-lg"
        onClick={() => {
          window.location.reload()
        }}
      >
        <FontAwesomeIcon icon={faArrowsRotate} />
        Reload
      </button>
      <button
        className="mt-6 btn btn-lg"
        onClick={() => {
          window.history.back()
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Go back
      </button>
    </div>
  )
}
