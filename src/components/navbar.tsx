import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { faQuestionCircle, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { ThemeController } from "./theme-controller"

export function Navbar(): JSX.Element {
  return (
    <div className="shadow-md navbar">
      <div className="navbar-start">
        <Link to={"/home"} className="btn btn-ghost">
          {/* <FontAwesomeIcon icon={faReact} size="2x" /> */}
          <span className="font-bold sm:text-lg bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            React Quiz
          </span>
        </Link>
      </div>
      <div className="navbar-end">
        <Link to={"/about"} className="btn btn-ghost max-sm:btn-sm">
          <FontAwesomeIcon icon={faQuestionCircle} />
        </Link>
        <Link
          to={"https://github.com/afdca/react-quiz"}
          target="_blank"
          className="btn btn-ghost max-sm:btn-sm"
        >
          <FontAwesomeIcon icon={faGithub} />
        </Link>
        <ThemeController />
        <Link to={"/profile"} className="btn btn-ghost max-sm:btn-sm">
          <FontAwesomeIcon icon={faUser} />
        </Link>
      </div>
    </div>
  )
}
