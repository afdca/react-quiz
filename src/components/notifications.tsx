import { useNotifications } from "@/features/notifications/notifications-store"
import type { INotification } from "@/types/notification"
import {
  faCheckCircle,
  faInfoCircle,
  faWarning,
  faX,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classix"

/** All the classes that can possibly be used must be hard-coded
 * to prevent them from being tree-shaken away by Tailwind at build time.
 * See:
 * - https://stackoverflow.com/questions/71818458/why-wont-tailwind-find-my-dynamic-class
 * - https://tailwindcss.com/docs/content-configuration#dynamic-class-names
 * */
const alertClasses: Record<INotification["type"], `alert-${string}` | ""> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
  loading: "",
}

const notificationIcons: Record<INotification["type"], JSX.Element> = {
  info: <FontAwesomeIcon icon={faInfoCircle} />,
  loading: <span className="loading loading-sm"></span>,
  success: <FontAwesomeIcon icon={faCheckCircle} />,
  warning: <FontAwesomeIcon icon={faWarning} />,
  error: <FontAwesomeIcon icon={faXmarkCircle} />,
}

export function Notifications(): JSX.Element {
  const notifications = useNotifications()

  return (
    <div className="toast toast-top toast-end z-[2] opacity-80">
      {notifications.current.map(({ id, type, message }) => (
        <div className={cx("flex gap-2 alert", alertClasses[type])} key={id}>
          {notificationIcons[type]}
          {message}{" "}
          <button
            className="btn btn-ghost btn-xs"
            onClick={() => {
              notifications.dismiss(id)
            }}
          >
            <span className="sr-only">Close</span>
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>
      ))}
    </div>
  )
}
