import { ScrollToTopButton } from "@/components/scroll-to-top-button"
import { useActiveSection } from "@/features/about/hooks/use-active-section"
import { useTheme } from "@/features/theme/hooks/use-theme"
import type { ICrumbHandle } from "@/types/crumb-handle"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cx from "classix"

interface ISection {
  id: string
  title: string
  Content: () => JSX.Element
}

const SECTIONS: ISection[] = [
  {
    id: "intro",
    title: "About this site",
    Content: () => (
      <p>
        React Quiz is a demo project I created for hands-on learning of React and AWS.
        <br />
        This site is a work in progress as I will continue to fix issues and add new features.
      </p>
    ),
  },
  {
    id: "stack",
    title: "Technical stack",
    Content: () => (
      <ul>
        <li>
          <a href="https://react.dev">React 18</a> + <a href="https://vitejs.dev">Vite</a> +{" "}
          <a href="https://www.typescriptlang.org">Typescript</a>
        </li>
        <li>
          <a href="https://reactrouter.com">React Router</a> - Routing
        </li>
        <li>
          <a href="https://tanstack.com/query">Tanstack Query</a> - Backend state management
        </li>
        <li>
          <a href="https://zustand.docs.pmnd.rs">Zustand</a> - Local state management
        </li>
        <li>
          <a href="https://github.com/sindresorhus/ky">Ky</a> - HTTP client
        </li>
        <li>
          <a href="https://react-hook-form.com">React Hook Form</a> - Form management
        </li>
        <li>
          <a href="https://daisyui.com">DaisyUI</a> +{" "}
          <a href="https://tailwindcss.com/">TailwindCss</a> +{" "}
          <a href="https://fontawesome.com">FontAwesome</a> - UI components and styling
        </li>
        <li>
          Hosted on <a href="https://aws.amazon.com/">Amazon AWS</a> - Cloud services provider
        </li>
      </ul>
    ),
  },

  {
    id: "architecture",
    title: "Architecture",
    Content: () => {
      const { currentThemeCategory } = useTheme()
      return (
        // TODO placeholder during loading
        <div>
          <img
            src={
              currentThemeCategory === "light"
                ? "/assets/architecture-light.png"
                : "/assets/architecture-dark.png"
            }
            alt="Architecture diagram"
          />
        </div>
      )
    },
  },
  {
    id: "todo",
    title: "Todo list",
    Content: () => (
      <ul>
        <li>❕ testing</li>
        <li>❕ handle remaining todos in source code</li>
        <li>❕ improve accessibility</li>
        <li>❕ /about route: image placeholders during loading</li>
        <li>🐞 Firefox: fix timebar animations</li>
        <li>🐞 Chrome/Edge: remove vertical scrollbar when popup opens</li>
        <li>
          ❕ Eslint{" "}
          <a href="https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-restricted-paths.md">
            no-restricted-paths
          </a>{" "}
          rule
        </li>
        <li>🎁 custom domain name</li>
        <li>🎁 create favicon</li>
        <li>🎁 add more questions to quizzes</li>
        <li>🎁 handle multi-tabs mode</li>
        <li>🎁 publish aws backend code</li>
      </ul>
    ),
  },
  {
    id: "more",
    title: "More",
    Content: () => (
      <p>
        See the project&apos;s{" "}
        <a href="https://github.com/afdca/react-quiz/blob/main/README.md">README file</a> for more
        implementation details.
      </p>
    ),
  },
  {
    id: "me",
    title: "About me",
    Content: () => (
      <div>
        <p>Fullstack developer with experience in Angular, React, Java, NodeJs and AWS.</p>
        {/* TODO remove this artificial margin which makes the IntersectionObserver work */}
        <p className="mb-96"></p>
      </div>
    ),
  },
]

export const aboutRouteHandle: ICrumbHandle = { crumbs: () => [{ to: "/about", label: "About" }] }

export function AboutRoute(): JSX.Element {
  const { activeSection, sectionsRef } = useActiveSection()

  const sections: JSX.Element[] = SECTIONS.map(({ id, title, Content }) => (
    // eslint-disable-next-line immutable/no-mutation
    <section key={id} id={id} ref={(el) => (sectionsRef.current[id] = el)}>
      <h2>{title}</h2>
      <Content />
    </section>
  ))
  const sidebarLinks: JSX.Element[] = SECTIONS.map(({ id, title }) => (
    <li key={"sidebar-".concat(id)}>
      <a
        href={`#${id}`}
        className={cx(
          "opacity-80 transition-opacity duration-300",
          activeSection === id && "opacity-100 text-primary font-bold"
        )}
      >
        {title}
      </a>
    </li>
  ))

  return (
    <div className="drawer md:drawer-open">
      <input id="about-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <div className="flex flex-col flex-1 md:ml-8 prose [&_a]:link [&_a]:link-primary [&_a]:font-semibold [&_ul]:list-inside">
          <label
            htmlFor="about-drawer"
            className="md:hidden drawer-button btn btn-secondary items-center sticky top-5 left-0 opacity-70 self-start"
            role="button"
            aria-label="open sidebar"
          >
            <FontAwesomeIcon icon={faBars} />
            <span>Menu</span>
          </label>
          {sections}
        </div>
      </div>
      <nav className="drawer-side border-r-2 border-r-base-content border-opacity-20">
        <label
          htmlFor="about-drawer"
          className="drawer-overlay md:hidden"
          aria-label="close sidebar"
        ></label>
        <div className="text-md font-bold max-md:hidden">On this page</div>
        <ul className="menu min-w-[14rem] max-md:bg-base-200 max-md:min-h-full">{sidebarLinks}</ul>
      </nav>
      <ScrollToTopButton behavior="smooth" />
    </div>
  )
}
