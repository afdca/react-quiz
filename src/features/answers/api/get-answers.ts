import { getApiClient } from "@/lib/api-client"
import type { IAnswer, IDynamoDbQueryResponse } from "@/types/api"
import { unmarshall } from "@aws-sdk/util-dynamodb"

interface DynamoDbAnswersDocument {
  answers: IAnswer[]
}

export async function getAnswers({ bundleId }: { bundleId: string }): Promise<IAnswer[]> {
  const jsonResponse = await getApiClient()
    .get(`cache/answers/${bundleId}`)
    .json<IDynamoDbQueryResponse>()
  const answersDocument = jsonResponse.Items[0]
  if (!answersDocument) return []
  const { answers } = unmarshall(answersDocument) as DynamoDbAnswersDocument
  return answers
}
