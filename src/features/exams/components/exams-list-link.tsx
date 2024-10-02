import type { IExam } from "@/types/api"
import { faBook, faLockOpen } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

export function ExamLinksList({ exams }: { exams: IExam[] }): JSX.Element {
  return (
    <>
      {exams.map((exam: IExam) => (
        <Link key={exam.id} className="btn btn-primary btn-outline" to={`/exams/${exam.id}`}>
          {!exam.isFreeAccess && <FontAwesomeIcon icon={faLockOpen} />}
          <FontAwesomeIcon icon={faBook} />
          {exam.title}
        </Link>
      ))}
    </>
  )
}
