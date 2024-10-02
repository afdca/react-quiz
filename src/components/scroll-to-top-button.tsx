import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { faArrowUp } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classix"
import { useEffect, useState } from "react"

/** Min scrollY value to be reached before showing the button */
const SCROLL_Y_THRESHOLD = 50

export function ScrollToTopButton({
  behavior = "auto",
}: {
  behavior?: ScrollBehavior
}): JSX.Element {
  const [isVisible, setIsVisible] = useState(false)
  const scrollToTop = useScrollToTop({ behavior })

  useEffect(function updateVisibility(): VoidFunction {
    const toggleVisibility = (): void => {
      setIsVisible(window.scrollY > SCROLL_Y_THRESHOLD)
    }
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <button
      onClick={scrollToTop}
      className={cx(
        "fixed z-[1] shadow-lg opacity-70 btn btn-neutral btn-circle bottom-5 right-5",
        !isVisible && "hidden"
      )}
      aria-label="Go to top"
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  )
}
