import { getApiClient } from "@/lib/api-client"
import type { IDynamoDbQueryResponse, IExam } from "@/types/api"
import { unmarshall } from "@aws-sdk/util-dynamodb"

export async function getExams(): Promise<IExam[]> {
  const jsonResponse = await getApiClient().get("cache/exams").json<IDynamoDbQueryResponse>()
  return jsonResponse.Items.map((item) => unmarshall(item)) as IExam[]
}
