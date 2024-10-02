import { renderHook } from "@testing-library/react"

import { useParams } from "react-router-dom"
import { beforeAll, beforeEach, expect, it, vi } from "vitest"
import { useRouteParams } from "./use-route-params"

beforeAll(() => {
  vi.mock("react-router-dom", () => ({
    useParams: vi.fn(),
  }))
})

beforeEach(() => {
  vi.resetAllMocks()
})

it("should return values derived from useParams()", () => {
  vi.mocked(useParams).mockReturnValueOnce({ bundleId: "bId", examId: "eId", questionNumber: "10" })
  const { bundleId, examId, questionIndex } = renderHook(useRouteParams).result.current
  expect(bundleId).toBe("bId")
  expect(examId).toBe("eId")
  expect(questionIndex).toBe(9)
})

it("should return empty values for missing useParams() values", () => {
  vi.mocked(useParams).mockReturnValueOnce({})
  const { bundleId, examId, questionIndex } = renderHook(useRouteParams).result.current
  expect(bundleId).toBe("")
  expect(examId).toBe("")
  expect(questionIndex).toBe(NaN)
})
