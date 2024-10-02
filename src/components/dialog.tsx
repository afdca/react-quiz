import { forwardRef, type ForwardedRef } from "react"

export const Dialog = forwardRef(function dialog(
  { children, actionButtons }: { children: JSX.Element; actionButtons?: JSX.Element },
  ref: ForwardedRef<HTMLDialogElement>
): JSX.Element {
  return (
    <dialog className="modal" ref={ref}>
      <div className="flex flex-col items-center gap-4 modal-box bg-base-100">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2">✕</button>
        </form>
        {children}
        <form method="dialog" className="modal-action">
          {actionButtons}
        </form>
      </div>
      {/* Close the modal when clicked outside */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
})
