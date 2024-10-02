import { act, renderHook } from "@testing-library/react"
import { useLocation, type Location } from "react-router-dom"
import { beforeAll, beforeEach, expect, it, vi } from "vitest"
import { useScrollToTop } from "./use-scroll-to-top"

beforeAll(() => {
  vi.mock("react-router-dom", () => ({
    useLocation: vi.fn(),
  }))
})

beforeEach(() => {
  vi.resetAllMocks()
  // eslint-disable-next-line immutable/no-mutation, @typescript-eslint/no-unnecessary-condition
  window.scrollTo ??= vi.fn().mockName("window.scrollTo")
})

it("should scroll to top", () => {
  vi.spyOn(window, "scrollTo")
  vi.mocked(useLocation).mockReturnValue({} as unknown as Location)

  const scrollToTop = renderHook(() => useScrollToTop()).result.current
  expect(window.scrollTo).not.toBeCalled()

  act(() => {
    scrollToTop()
  })

  expect(window.scrollTo).toBeCalledTimes(1)
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "auto" })
})

it("should auto-scroll to top", () => {
  vi.spyOn(window, "scrollTo")
  vi.mocked(useLocation).mockReturnValue({ pathname: "path1" } as unknown as Location)
  expect(window.scrollTo).not.toBeCalled()

  const hookHandle = renderHook(() => useScrollToTop({ autoScrollOnLocationChange: true }))
  expect(window.scrollTo).toBeCalledTimes(1)

  act(() => {
    hookHandle.rerender()
  })
  expect(window.scrollTo).toBeCalledTimes(1)

  act(() => {
    // emulate a location change
    vi.mocked(useLocation).mockReturnValue({ pathname: "path2" } as unknown as Location)
    hookHandle.rerender()
  })
  expect(window.scrollTo).toBeCalledTimes(2)
  expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "auto" })
  expect(hookHandle.result.current).toBeDefined()
})
