import { useCallback, useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"

const DEFAULT_OPTIONS = {
  autoScrollOnLocationChange: false,
  behavior: "auto",
} as const

export function useScrollToTop({
  autoScrollOnLocationChange = DEFAULT_OPTIONS.autoScrollOnLocationChange,
  behavior = DEFAULT_OPTIONS.behavior,
}: {
  /**
   * Auto-scroll to the top of the page whenever the location changes
   *
   * Default = `false`
   * */
  autoScrollOnLocationChange?: boolean
  /**
   * Scroll behavior of the browser
   *
   * Default = `"auto"`
   * */
  behavior?: ScrollBehavior
} = DEFAULT_OPTIONS): VoidFunction {
  /* 
  `useRef` is used here instead of `useState`
  because it avoids unnecessary re-renders caused by state updates when options change.
  */
  const optionsRef = useRef({ autoScrollOnLocationChange, scrollBehavior: behavior })
  // eslint-disable-next-line immutable/no-mutation
  optionsRef.current = { autoScrollOnLocationChange, scrollBehavior: behavior }
  const location = useLocation()
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: optionsRef.current.scrollBehavior })
  }, [])

  useEffect(
    function autoScrollToTopWhenLocationChanges(): void {
      if (optionsRef.current.autoScrollOnLocationChange) scrollToTop()
    },
    [location, scrollToTop]
  )
  return scrollToTop
}
