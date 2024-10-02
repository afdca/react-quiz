import type { To, UIMatch } from "react-router-dom"

export interface ICrumbData {
  label: JSX.Element | string
  to?: To
}
export interface ICrumbHandle {
  crumbs: (uiMatch: UIMatch<unknown, ICrumbHandle>) => ICrumbData[]
}
