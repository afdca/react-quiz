import { useTheme } from "@/features/theme/hooks/use-theme"
import { faChevronDown, faPalette } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function ThemeController(): JSX.Element {
  const { currentTheme, allThemes, setTheme } = useTheme()

  return (
    <div className="dropdown shrink-0">
      <div tabIndex={0} role="button" className="btn btn-ghost max-sm:btn-sm !pr-1 text-primary">
        <FontAwesomeIcon icon={faPalette} />
        <FontAwesomeIcon icon={faChevronDown} size="xs" />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content bg-neutral text-neutral-content rounded-box z-[1] m-2 shadow-2xl"
      >
        {allThemes.map((theme) => (
          <li key={theme}>
            <input
              type="radio"
              name="theme-dropdown"
              className="justify-start capitalize theme-controller btn btn-sm btn-block btn-ghost max-sm:btn-xs"
              aria-label={theme}
              value={theme}
              checked={theme === currentTheme}
              onChange={() => {
                setTheme(theme)
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
