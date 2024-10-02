import type { INotification } from "@/types/notification"
import { create } from "zustand"

interface INotificationWithPromise {
  promise: Promise<unknown>
  successMsg: string
  pendingMsg: string
  errorMsg: string
  pendingDuration?: number
  successDuration?: number
  errorDuration?: number
}

type INotificationWithId = INotification & {
  id: string
}

interface INotificationsStore {
  current: INotificationWithId[]
  add: (notification: INotification) => string
  dismiss: (id: string) => void
  promise: (notification: INotificationWithPromise) => void
}

export const useNotifications = create<INotificationsStore>((setState) => {
  const dismiss = (id: string): void => {
    setState((state: INotificationsStore) => ({
      current: state.current.filter((notification) => notification.id !== id),
    }))
  }
  const add = (notification: INotification): string => {
    const id = `${String(Date.now())} - ${notification.message}`
    setState((state: INotificationsStore) => ({
      current: state.current.concat({ ...notification, id }),
    }))
    if (notification.duration !== undefined && !isNaN(notification.duration)) {
      setTimeout(() => {
        dismiss(id)
      }, Math.max(0, notification.duration))
    }
    return id
  }

  const promise = (notification: INotificationWithPromise): void => {
    const id: string = add({
      type: "loading",
      message: notification.pendingMsg,
      // No default duration here: leave the message for as long as status is pending
      duration: notification.pendingDuration,
    })

    notification.promise
      .finally(() => {
        dismiss(id)
      })
      .then(() => {
        add({
          message: notification.successMsg,
          type: "success",
          duration: notification.successDuration,
        })
      })
      .catch((error: unknown) => {
        add({
          message: notification.errorMsg,
          type: "error",
          duration: notification.errorDuration,
        })
        throw error
      })
  }

  return { current: [], add, dismiss, promise }
})
