import type { ICrumbData, ICrumbHandle } from "@/types/crumb-handle"
import { Link, useMatches, type UIMatch } from "react-router-dom"

function isCrumbHandle(o: unknown): o is ICrumbHandle {
  return (
    !!o &&
    typeof o === "object" &&
    ("crumbs" satisfies keyof ICrumbHandle) in o &&
    typeof o.crumbs === "function"
  )
}

export function Breadcrumbs(): JSX.Element {
  const matches: UIMatch[] = useMatches()
  const crumbs: ICrumbData[] = matches
    .filter((match): match is UIMatch<unknown, ICrumbHandle> => isCrumbHandle(match.handle))
    .flatMap((match) => match.handle.crumbs(match))
  const isSingleCrumb: boolean = crumbs.length === 1

  return (
    <div className="max-sm:text-sm breadcrumbs text-primary">
      <ol className="flex justify-center">
        {!isSingleCrumb &&
          crumbs.map((crumb, i) => {
            const isLastCrumb: boolean = i + 1 === crumbs.length
            return (
              <li key={i}>
                {!isLastCrumb && crumb.to ? (
                  <Link className="link" to={crumb.to}>
                    {crumb.label}
                  </Link>
                ) : (
                  crumb.label
                )}
              </li>
            )
          })}
      </ol>
    </div>
  )
}
