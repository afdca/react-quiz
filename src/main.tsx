import { GenericErrorBoundary } from "@/components/generic-error-boundary"
import { getQueryClient } from "@/lib/query-client"
import { Root, rootRouteHandle } from "@/root"
import { AboutRoute, aboutRouteHandle } from "@/routes/about-route"
import {
  AttemptQuestionRoute,
  attemptQuestionRouteLoader,
} from "@/routes/attempt/attempt-question-route"
import { AttemptRoute, attemptRouteHandle } from "@/routes/attempt/attempt-route"
import {
  AttemptSummaryRoute,
  attemptSummaryRouteLoader,
} from "@/routes/attempt/attempt-summary-route"
import { BundlesListRoute, bundlesListRouteLoader } from "@/routes/bundles-list-route"
import {
  ExamsListRoute,
  examsListRouteHandle,
  examsListRouteLoader,
} from "@/routes/exams-list-route"
import { LoginRoute, loginRouteHandle } from "@/routes/login-route"
import { LogoutRoute } from "@/routes/logout-route"
import {
  ResultQuestionRoute,
  resultQuestionRouteLoader,
} from "@/routes/result/result-question-route"
import { ResultRoute, resultRouteHandle, resultRouteLoader } from "@/routes/result/result-route"
import { ResultSummaryRoute, resultSummaryRouteLoader } from "@/routes/result/result-summary-route"
import {
  profileRouteHandle,
  profileRouteLoader,
  UserProfileRoute,
} from "@/routes/user-profile-route"
import { createAppRouter } from "@/utils/router"
import { config } from "@fortawesome/fontawesome-svg-core"
import { QueryClientProvider } from "@tanstack/react-query"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { Navigate, RouterProvider } from "react-router-dom"
import { attemptRouteLoader } from "./routes/attempt/attempt-route"
import { ExamRoute, examRouteHandle, examRouteLoader } from "./routes/exam-route"
import { HomeRoute } from "./routes/home-route"
import { startMockServiceWorker } from "./testing/mocks/browser"

/*
 * Prevent Fontawesome from inlining css, in order to prevent Content Security Policy errors.
 * See: https://docs.fontawesome.com/v5/web/other-topics/security#content-security-policy
 */
// eslint-disable-next-line immutable/no-mutation
config.autoAddCss = false

const router = createAppRouter([
  {
    path: "/",
    Component: Root,
    ErrorBoundary: GenericErrorBoundary,
    handle: rootRouteHandle,
    children: [
      { path: "home", Component: HomeRoute },
      {
        path: "about",
        Component: AboutRoute,
        ErrorBoundary: GenericErrorBoundary,
        handle: aboutRouteHandle,
      },
      {
        path: "login",
        Component: LoginRoute,
        handle: loginRouteHandle,
        ErrorBoundary: GenericErrorBoundary,
      },
      { path: "logout", Component: LogoutRoute },
      {
        path: "profile",
        Component: UserProfileRoute,
        handle: profileRouteHandle,
        loader: profileRouteLoader,
      },
      {
        path: "exams",
        Component: ExamsListRoute,
        handle: examsListRouteHandle,
        loader: examsListRouteLoader,
        ErrorBoundary: GenericErrorBoundary,
      },
      {
        path: "exams/:examId",
        Component: ExamRoute,
        loader: examRouteLoader,
        ErrorBoundary: GenericErrorBoundary,
        handle: examRouteHandle,
        children: [
          {
            index: true,
            Component: BundlesListRoute,
            loader: bundlesListRouteLoader,
          },
          {
            path: "bundles/:bundleId",
            children: [
              {
                path: "attempt",
                Component: AttemptRoute,
                loader: attemptRouteLoader,
                handle: attemptRouteHandle,
                ErrorBoundary: GenericErrorBoundary,
                children: [
                  {
                    path: "summary",
                    Component: AttemptSummaryRoute,
                    loader: attemptSummaryRouteLoader,
                  },
                  {
                    path: "questions/:questionNumber",
                    Component: AttemptQuestionRoute,
                    loader: attemptQuestionRouteLoader,
                  },
                  { index: true, Component: () => <Navigate to="summary" replace /> },
                ],
              },
              {
                path: "result",
                Component: ResultRoute,
                loader: resultRouteLoader,
                handle: resultRouteHandle,
                ErrorBoundary: GenericErrorBoundary,
                children: [
                  {
                    path: "summary",
                    Component: ResultSummaryRoute,
                    loader: resultSummaryRouteLoader,
                  },
                  {
                    path: "questions/:questionNumber",
                    Component: ResultQuestionRoute,
                    loader: resultQuestionRouteLoader,
                  },
                  { index: true, Component: () => <Navigate to="summary" replace /> },
                ],
              },
              { index: true, Component: () => <Navigate to="../" replace /> },
            ],
          },
        ],
      },
      { index: true, Component: () => <Navigate to="/home" replace /> },
    ],
  },
  { path: "*", Component: () => <Navigate to="/home" replace /> },
])

const root: HTMLElement | null = document.getElementById("root")
if (!root) throw Error("Root element not found")

const queryClient = getQueryClient()

if (import.meta.env.DEV && import.meta.env["VITE_APP_MSW_ENABLED"] === "true") {
  await startMockServiceWorker()
}

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* {import.meta.env.DEV && <ReactQueryDevtools />} */}
    </QueryClientProvider>
  </StrictMode>
)
