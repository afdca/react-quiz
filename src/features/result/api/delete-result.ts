import { getApiClient } from "@/lib/api-client"

export async function deleteResult({ bundleId }: { bundleId: string }): Promise<void> {
  await getApiClient().delete(`results/${bundleId}`)
}
