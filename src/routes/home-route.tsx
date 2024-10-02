import { Link } from "react-router-dom"

export function HomeRoute(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col flex-1 text-center prose">
        <h1>
          Welcome to{" "}
          <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            React Quiz!
          </span>
        </h1>
        <p className="text-lg">
          Choose an exam, select your topic...
          <br />
          And race against the clock to answer as many questions as you can!
        </p>
      </div>
      <Link to={"/exams"} className="btn btn-primary">
        Go to exams list
      </Link>
    </div>
  )
}
