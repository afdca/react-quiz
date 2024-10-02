import type { unmarshall } from "@aws-sdk/util-dynamodb"

type IDynamoDbItem = Parameters<typeof unmarshall>[0]
export interface IDynamoDbQueryResponse {
  Items: IDynamoDbItem[]
}

export interface IDynamoDbGetItemResponse {
  Item: IDynamoDbItem
}

export interface IExam {
  id: string
  title: string
  level: "guest" | "beginner" | "intermediate" | "advanced"
  bundles: IBundle[]
  isFreeAccess?: boolean
}

export interface IBundle {
  id: string
  title: string
  allottedTime: number
  minPassingScore: number
  result?: IResult | undefined
}

export interface IResult {
  userId: string
  bundleId: string
  timestamp: number
  flaggedQuestions: number[]
  selectedChoicesMatrix: Record<number, number[]>
  scorePercent: number
  duration: number
}

export interface IQuestion {
  questionText: string
  choices: string[]
  multiChoice: boolean
}

export interface IAnswer {
  correctChoices: number[]
  correctChoicesDetail: string
}

export interface IAuthToken {
  expiresIn: number
  idToken: string
  username: string
}

export type IUser = Pick<IAuthToken, "expiresIn"> & {
  username: string
  isPro: boolean
}

export interface ILoginInput {
  username: string
  password: string
}
