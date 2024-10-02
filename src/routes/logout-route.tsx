import { Link } from "react-router-dom"

export function LogoutRoute(): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <p>You have successfully logged out</p>
      <Link to={"/login"} className="link">
        Log in
      </Link>
      <Link to={"/"} className="link">
        Go to homepage
      </Link>
    </div>
  )
}
