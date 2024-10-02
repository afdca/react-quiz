import { useEffect, useRef, useState, type MutableRefObject } from "react"

export function useActiveSection(): {
  activeSection: string | null
  sectionsRef: MutableRefObject<Record<string, HTMLElement | null>>
} {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const sectionsRef = useRef({} as Record<string, HTMLElement | null>)
  const intersectionsRef = useRef({} as Record<string, boolean>)

  useEffect(function observeActiveSection(): VoidFunction {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        // eslint-disable-next-line immutable/no-mutation
        entries.forEach((e) => (intersectionsRef.current[e.target.id] = e.isIntersecting))
        // The active section is defined as the highest visible section on the page
        const activeSectionId = Object.entries(intersectionsRef.current).find(
          ([, isIntersecting]) => isIntersecting
        )?.[0]
        if (activeSectionId) setActiveSection(activeSectionId)
      },
      { threshold: 0.8 }
    )

    Object.values(sectionsRef.current)
      .filter((section) => !!section)
      .forEach((section) => {
        observer.observe(section)
      })

    return () => {
      observer.disconnect()
    }
  }, [])

  return { activeSection, sectionsRef }
}
