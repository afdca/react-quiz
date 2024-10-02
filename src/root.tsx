import { Breadcrumbs } from "@/components/bread-crumbs"
import { Navbar } from "@/components/navbar"
import { Notifications } from "@/components/notifications"
import { faHome } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import type { ICrumbHandle } from "./types/crumb-handle"

function LoadingSpinner(): JSX.Element {
  return (
    <span className="mx-auto my-auto loading text-primary loading-lg animate-pulse">
      Loading...
    </span>
  )
}

export const rootRouteHandle: ICrumbHandle = {
  crumbs: () => [{ to: "/home", label: <FontAwesomeIcon icon={faHome} /> }],
}

export function Root(): JSX.Element {
  return (
    <main className="flex flex-col flex-1">
      <Notifications />
      <Navbar />
      <Suspense fallback={null}>
        {/* Notes:
        - Breadcrumbs must be inside *a* Suspense boundary because some crumbs call useSuspenseQuery
        - Breadcrumbs must be inside *their own* Suspense boundary, otherwise they do not show until *all* suspense queries resolve.
        */}
        <Breadcrumbs />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="flex flex-col items-center flex-1 gap-2 m-4">
          <Outlet />
        </div>
      </Suspense>
    </main>
  )
}
