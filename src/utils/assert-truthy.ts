import { AppError } from "@/utils/app-error"

export function assertTruthy(
  condition: unknown,
  context: Record<string, unknown> = {}
): asserts condition {
  if (!condition) throw AppError.of({ context })
}
