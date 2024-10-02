import { faCheck, faX } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classix"
import { Link } from "react-router-dom"

enum QuestionStatus {
  NoAnswer = "NoAnswer",
  Answer = "Answer",
  Success = "Success",
  Fail = "Fail",
}

function QuestionBadge({ className }: { className?: string }): JSX.Element {
  return (
    <span
      className={cx(
        "scale-[70%] translate-x-1/3 -translate-y-1/3 indicator-item badge badge-xs rounded-full",
        className
      )}
    ></span>
  )
}

export function QuestionsNavbar({
  flaggedQuestions,
  questionsStatusList,
  selectedQuestionIndex,
}: {
  questionsStatusList: `${QuestionStatus}`[]
  flaggedQuestions: number[]
  selectedQuestionIndex: number | undefined
}): JSX.Element {
  return (
    <ul className="flex flex-wrap gap-2">
      {questionsStatusList.map((status: `${QuestionStatus}`, i: number) => {
        const isSelectedQuestion = selectedQuestionIndex === i
        return (
          // Using the question index as a key is ok here because the list does not change
          <li key={i} className="indicator group">
            <Link
              to={`./questions/${String(i + 1)}`}
              className={cx(
                "btn btn-circle btn-xs transition duration-300",
                isSelectedQuestion && "scale-110 font-bold btn-primary"
              )}
            >
              {status !== QuestionStatus.NoAnswer && (
                <FontAwesomeIcon
                  icon={status === QuestionStatus.Fail ? faX : faCheck}
                  className={cx(
                    !isSelectedQuestion && status === QuestionStatus.Success && "text-success",
                    !isSelectedQuestion && status === QuestionStatus.Answer && "text-primary",
                    "group-hover:hidden"
                  )}
                />
              )}
              <span
                className={cx(
                  status !== QuestionStatus.NoAnswer && "hidden group-hover:inline"
                  // !isSelectedQuestion && status === QuestionStatus.Success && "text-primary",
                  // !isSelectedQuestion && status === QuestionStatus.Fail && "text-error"
                )}
              >
                {i + 1}
              </span>
            </Link>
            {flaggedQuestions.includes(i) && <QuestionBadge className="badge-accent" />}
          </li>
        )
      })}
    </ul>
  )
}
