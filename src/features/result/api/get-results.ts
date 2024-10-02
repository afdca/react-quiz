import { getApiClient } from "@/lib/api-client"
import type { IDynamoDbQueryResponse, IResult } from "@/types/api"
import { unmarshall } from "@aws-sdk/util-dynamodb"

export async function getResults(): Promise<IResult[]> {
  const jsonResponse = await getApiClient().get("results").json<IDynamoDbQueryResponse>()
  return jsonResponse.Items.map((item) => unmarshall(item)) as IResult[]
}
