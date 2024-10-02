import { getApiClient } from "@/lib/api-client"
import type { IDynamoDbQueryResponse, IQuestion } from "@/types/api"
import { unmarshall } from "@aws-sdk/util-dynamodb"

interface DynamoDbQuestionsDocument {
  questions: IQuestion[]
}

export async function getQuestions({ bundleId }: { bundleId: string }): Promise<IQuestion[]> {
  const jsonResponse = await getApiClient()
    .get(`cache/questions/${bundleId}`)
    .json<IDynamoDbQueryResponse>()
  const questionsDocument = jsonResponse.Items[0]
  if (!questionsDocument) return []
  const { questions } = unmarshall(questionsDocument) as DynamoDbQuestionsDocument
  return questions
}
