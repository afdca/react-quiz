export interface INotification {
  type: "info" | "warning" | "success" | "error" | "loading"
  message: string
  duration?: number | undefined
}
