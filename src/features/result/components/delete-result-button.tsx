import { faExclamationCircle, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classix"
import { useRef } from "react"

export function DeleteResultButton({
  disabled,
  onDelete,
}: {
  disabled?: boolean
  onDelete: VoidFunction
}): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null)

  // TODO use dialog component instead
  return (
    <>
      <dialog className="modal" ref={dialogRef}>
        <div className="flex flex-col items-center gap-2 modal-box bg-base-100">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
          </form>
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-primary" />
            <span>Delete result</span>
          </h3>
          <p>Are you sure you want to delete this result?</p>
          <form method="dialog" className="modal-action">
            <button className="btn btn-primary" onClick={onDelete}>
              <FontAwesomeIcon icon={faTrash} />
              Delete result
            </button>
            <button className="btn">Cancel</button>
          </form>
        </div>
        {/* Close the modal when clicked outside */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <button
        className={cx("btn btn-xs sm:btn-md", disabled && "animate-pulse")}
        onClick={() => dialogRef.current?.showModal()}
        disabled={disabled}
      >
        <FontAwesomeIcon icon={faTrash} />
        Delete
      </button>
    </>
  )
}
