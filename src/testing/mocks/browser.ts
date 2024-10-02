import { getHandlers } from "@/testing/mocks/handlers"
import { setupWorker } from "msw/browser"

export async function startMockServiceWorker(): Promise<void> {
  await setupWorker(...getHandlers()).start()
}
