import { useNotifications } from "@/features/notifications/notifications-store"
import { useLogin } from "@/lib/auth"
import type { ILoginInput } from "@/types/api"
import type { ICrumbHandle } from "@/types/crumb-handle"
import {
  faInfoCircle,
  faKey,
  faUser,
  faUserPlus,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classix"
import { useForm, type FieldValues } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"

export const loginRouteHandle: ICrumbHandle = {
  crumbs: () => [{ to: "/login", label: "Sign in" }],
}

export function LoginRoute(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ username: string; password: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo: string | null = searchParams.get("redirectTo")
  const login = useLogin({
    onSuccess: () => {
      navigate(redirectTo ?? "/exams", { replace: !!redirectTo })
    },
  })
  const notifications = useNotifications()

  const loginWithNotification = (...args: Parameters<(typeof login)["mutateAsync"]>) => {
    notifications.promise({
      promise: login.mutateAsync(...args),
      pendingMsg: "Signing in, please wait...",
      successMsg: "Sign in successful",
      successDuration: 4_000,
      errorMsg: "An error has occurred, please try again later",
      errorDuration: 4_000,
    })
  }

  const usernameErrorMessage = errors.username?.message
  const passwordErrorMessage = errors.password?.message

  return (
    <>
      <form
        className="flex flex-col items-center self-center max-w-xs gap-4"
        // See: https://github.com/orgs/react-hook-form/discussions/8020
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit((values: FieldValues) => {
          loginWithNotification(values as ILoginInput)
        })}
      >
        {!!redirectTo && (
          <div className="flex alert">
            <FontAwesomeIcon icon={faInfoCircle} />
            Sign in required
          </div>
        )}
        <label
          className={cx(
            "flex items-center gap-2 input input-bordered",
            !!usernameErrorMessage && "input-error"
          )}
        >
          <FontAwesomeIcon icon={faUser} size="xs" className="opacity-70" />
          <input
            {...register("username", { required: true })}
            type="text"
            placeholder="Username"
            disabled={login.isPending}
          />
        </label>
        {!!usernameErrorMessage && <FormError error={usernameErrorMessage} />}
        <label
          className={cx(
            "flex items-center gap-2 input input-bordered",
            !!passwordErrorMessage && "input-error"
          )}
        >
          <FontAwesomeIcon icon={faKey} size="xs" className="opacity-70" />
          <input
            {...register("password", { required: true, minLength: 5 })}
            type="password"
            placeholder="Password"
            disabled={login.isPending}
          />
        </label>
        {!!passwordErrorMessage && <FormError error={passwordErrorMessage} />}
        <button
          type="submit"
          className={cx("btn btn-primary btn-outline", login.isPending && "animate-pulse")}
          disabled={login.isPending}
        >
          <FontAwesomeIcon icon={faUser} />
          <span>Sign in</span>
        </button>
      </form>
      <span className="font-bold divider text-secondary">Or</span>
      <button
        className="btn btn-primary btn-outline"
        onClick={() => {
          loginWithNotification("guest")
        }}
        disabled={login.isPending}
      >
        <FontAwesomeIcon icon={faUserSlash} />
        <span>Guest sign in</span>
      </button>
      <div className="text-center text-xs font-extralight">No credentials needed</div>
      <div className="text-center text-xs font-extralight">Limited access to resources</div>
      <span className="font-bold divider text-secondary">Or</span>
      <button className="btn btn-primary btn-disabled" disabled>
        <FontAwesomeIcon icon={faUserPlus} />
        <span>Register</span>
      </button>
      <div className="text-center text-xs font-extralight">User registration is not available</div>
    </>
  )
}

function FormError({ error }: { error: unknown }): JSX.Element {
  return <p className="font-bold text-error">{String(error)}</p>
}
