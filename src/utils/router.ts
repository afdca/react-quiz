import { createBrowserRouter } from "react-router-dom"

type Router = ReturnType<typeof createBrowserRouter>
let router: Router | null = null

export function createAppRouter(...args: Parameters<typeof createBrowserRouter>): Router {
  return (router ??= createBrowserRouter(...args))
}

export async function navigateToLoginRoute(): Promise<void> {
  if (!router) throw Error("Router is not initialized")
  if (!location.pathname.startsWith("/login")) {
    const redirectUrl: string =
      router.state.navigation.state === "loading"
        ? // If there is an ongoing navigation, redirect to that url instead of the current page
          router.state.navigation.location.pathname
        : location.pathname
    await router.navigate(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`)
  }
}
