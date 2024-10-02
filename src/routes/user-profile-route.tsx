import { useNotifications } from "@/features/notifications/notifications-store"
import { getAuthQueryOptions, useLogout } from "@/lib/auth"
import { getQueryClient } from "@/lib/query-client"
import type { ICrumbHandle } from "@/types/crumb-handle"
import { faRightFromBracket, faUser, faUserSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSuspenseQuery } from "@tanstack/react-query"
import cx from "classix"
import { useNavigate } from "react-router-dom"

export function profileRouteLoader(): true {
  void getQueryClient().prefetchQuery(getAuthQueryOptions())
  return true
}

export const profileRouteHandle: ICrumbHandle = {
  crumbs: (match) => [{ to: match.pathname, label: "Profile" }],
}

export function UserProfileRoute(): JSX.Element {
  const navigate = useNavigate()
  const notifications = useNotifications()
  const { data: user } = useSuspenseQuery(getAuthQueryOptions())

  const logout = useLogout({
    onSuccess: () => {
      navigate("/login")
    },
    onError: () => {
      notifications.add({
        type: "error",
        message: "An error has occurred, please try again later",
        duration: 4_000,
      })
    },
  })

  return (
    <div className="flex flex-col gap-6 mt-4">
      <div className="text-center">Signed in as:</div>
      <div className="flex gap-2 items-center justify-center text-secondary">
        <FontAwesomeIcon icon={!user.isPro ? faUserSlash : faUser} />
        <span className="font-bold capitalize">{user.username}</span>
      </div>
      <button
        className={cx("btn btn-primary btn-outline", logout.isPending && "animate-pulse")}
        onClick={() => {
          notifications.promise({
            promise: logout.mutateAsync({}),
            pendingMsg: "Signing out, please wait...",
            successMsg: "Sign out successful",
            successDuration: 4_000,
            errorMsg: "An error has occurred, please try again later",
            errorDuration: 4_000,
          })
        }}
        disabled={logout.isPending}
      >
        <FontAwesomeIcon icon={faRightFromBracket} />
        <span>Sign out</span>
      </button>
    </div>
  )
}
